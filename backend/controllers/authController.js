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
       [${UsersTable.COL_PASSWORD_CHANGED_AT}],
       [${UsersTable.COL_PASSWORD_RESET_EXPIRES}],
       [${UsersTable.COL_PASSWORD_RESET_TOKEN}])
       VALUES( 
          @${UsersTable.COL_EMAIL} ,
          @${UsersTable.COL_USERNAME} ,
          @${UsersTable.COL_PASSWORD}, 
          @${UsersTable.COL_ROLE},
          @${UsersTable.COL_HIGHSCORE},
          @${UsersTable.COL_PASSWORD_CHANGED_AT},
          @${UsersTable.COL_PASSWORD_RESET_EXPIRES},
          @${UsersTable.COL_PASSWORD_RESET_TOKEN}
         ); SELECT SCOPE_IDENTITY() AS id;`;

    const pool = await dbClient.getConnection(config.sql);
    const newUser = await pool
      .request()
      .input(UsersTable.COL_EMAIL, dbClient.sql.VarChar, user.getEmail())
      .input(UsersTable.COL_USERNAME, dbClient.sql.VarChar, user.getUsername())
      .input(
        UsersTable.COL_PASSWORD,
        dbClient.sql.VarChar,
        await bcrypt.hash(user.getPassword(), 12)
      )
      .input(UsersTable.COL_ROLE, dbClient.sql.VarChar, user.getRole())
      .input(UsersTable.COL_HIGHSCORE, dbClient.sql.Int, user.getHighscore())
      .input(
        UsersTable.COL_PASSWORD_CHANGED_AT,
        dbClient.sql.DateTime,
        user.getPasswordChangedAt()
      )
      .input(
        UsersTable.COL_PASSWORD_RESET_TOKEN,
        dbClient.sql.VarChar,
        user.getPasswordResetToken()
      )
      .input(
        UsersTable.COL_PASSWORD_RESET_EXPIRES,
        dbClient.sql.DateTime,
        user.getPasswordResetExpires()
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

const getUserByEmail = async (email, next) => {
  try {
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

    const userFromDb = await pool.request().query(findUserByEmailQuery);
    if (!userFromDb.recordsets[0][0]) {
      throw new AppError("no user found", 400);
    }
    return { ...userFromDb.recordsets[0][0] };
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError("Please provide email and password!", 400));
  }

  userFromDb = await getUserByEmail(email);

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

const forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body || !req.body.email) {
    return next(new AppError("Please provide email to reset password!", 401));
  }

  const user = await getUserByEmail(req.body.email);

  const currentUser = new User(
    user.email,
    user.username,
    user.password,
    user.role,
    user._ID,
    user.passwordChangedAt
  );

  if (!user) {
    return next(new AppError("There is no user with this email address!", 404));
  }
  const resetToken = currentUser.createPasswordResetToken();

  const pool = await dbClient.getConnection(config.sql);

  const updateUserResetTokenQuery = `UPDATE [${config.sql.database}].[dbo].[${
    UsersTable.TABLE_NAME
  }]
              SET
              ${UsersTable.COL_PASSWORD_RESET_EXPIRES} = '${new Date(
    currentUser.getPasswordResetExpires()
  ).toISOString()}' ,
              ${
                UsersTable.COL_PASSWORD_RESET_TOKEN
              } = '${currentUser.getPasswordResetToken()}' 
              WHERE _ID = ${currentUser.getId()}`;

  console.log(updateUserResetTokenQuery);
  await pool.request().query(updateUserResetTokenQuery);
});

const resetPassword = (req, res, next) => {};
module.exports = { onCreate, signup, login, forgotPassword, resetPassword };
