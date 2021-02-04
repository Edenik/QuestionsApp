const jws = require("jsonwebtoken");
const config = require("../config");
const UsersTable = require("../data/users/usersTable");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const dbClient = require("../utils/dbClient");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jws.sign({ id }, config.jwtSecret, {
    expiresIn: "7d",
  });
};
const onCreate = catchAsync(async (req, res, next) => {
  const newUser = await signup({ user: req.body.userOBJ, jwt: true });

  res.status(201).json({
    status: "success",
    token: newUser["token"],
    data: {
      id: newUser["id"],
    },
  });
});

const signup = async ({ user, jwt }) => {
  try {
    const newUserQuery = `INSERT INTO [dbo].[${UsersTable.TABLE_NAME}]
    ([${UsersTable.COL_EMAIL}], 
      [${UsersTable.COL_USERNAME}], 
       [${UsersTable.COL_PASSWORD}], 
       [${UsersTable.COL_ROLE}], 
       [${UsersTable.COL_HIGHSCORE}],
       [${UsersTable.COL_PASSWORD_CHANGED_AT}])
       VALUES( 
          @${UsersTable.COL_EMAIL} ,
          @${UsersTable.COL_USERNAME} ,
          @${UsersTable.COL_PASSWORD}, 
          @${UsersTable.COL_ROLE},
          @${UsersTable.COL_HIGHSCORE},
          @${UsersTable.COL_PASSWORD_CHANGED_AT}
         ); SELECT SCOPE_IDENTITY() AS id;`;

    console.log(newUserQuery);
    const pool = await dbClient.getConnection(config.sql);
    const newUser = await pool
      .request()
      .input(UsersTable.COL_EMAIL, dbClient.sql.Text, user.getEmail())
      .input(UsersTable.COL_USERNAME, dbClient.sql.Text, user.getUsername())
      .input(
        UsersTable.COL_PASSWORD,
        dbClient.sql.Text,
        await bcrypt.hash(user.getPassword(), 12)
      )
      .input(UsersTable.COL_ROLE, dbClient.sql.Text, user.getRole())
      .input(UsersTable.COL_HIGHSCORE, dbClient.sql.Int, user.getHighscore())
      .input(
        UsersTable.COL_PASSWORD_CHANGED_AT,
        dbClient.sql.DateTime,
        user.getPasswordChangedAt()
      )
      .output()
      .query(newUserQuery)
      .catch((err) => {
        throw new AppError("Error with DB! (No data or connection error)");
      });
    let token;
    if (jwt === true) {
      token = signToken(newUser.recordsets[0][0].id);
    }
    return { id: newUser.recordsets[0][0]["id"], token };
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError("Please provide email and password!", 400));
  }

  const findUserByEmailQuery = `SELECT [_ID]
  ,[${UsersTable.COL_EMAIL}]
  ,[${UsersTable.COL_USERNAME}]
  ,[${UsersTable.COL_PASSWORD}]
  ,[${UsersTable.COL_ROLE}]
  ,[${UsersTable.COL_HIGHSCORE}]
  ,[${UsersTable.COL_PASSWORD_CHANGED_AT}]
FROM [QuizApp].[dbo].[users] 
WHERE email = '${email}'`;
  const pool = await dbClient.getConnection(config.sql);

  let userFromDb = await pool.request().query(findUserByEmailQuery);
  userFromDb = { ...userFromDb.recordsets[0][0] };

  const currentUser = new User(
    userFromDb.email,
    userFromDb.username,
    userFromDb.password,
    userFromDb.role,
    userFromDb._ID,
    userFromDb.passwordChangedAt
  );

  if (
    !userFromDb.email ||
    !userFromDb.password ||
    !(await currentUser.checkPassword(password, currentUser.getPassword()))
  ) {
    next(new AppError("Incorrect email or password!", 401));
  }

  const token = signToken(currentUser.getId());
  res.status(200).json({
    status: "success",
    user: currentUser,
    token,
  });
});

module.exports = { onCreate, signup, login };
