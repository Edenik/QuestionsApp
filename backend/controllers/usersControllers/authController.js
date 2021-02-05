const jwt = require("jsonwebtoken");
const jwtSimple = require("jwt-simple");
const config = require("../../config");
const UsersTable = require("../../data/users/usersTable");
const User = require("../../models/userModel");
const catchAsync = require("../../utils/catchAsync");
const dbClient = require("../../utils/dbClient");
const bcrypt = require("bcryptjs");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const filterObj = require("../../utils/filterObj");

const signToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: "7d",
  });
};

const getUserByCondition = async (key, value) => {
  try {
    const findUserByConditionQuery = `SELECT [_ID]
    ,[${UsersTable.COL_EMAIL}]
    ,[${UsersTable.COL_USERNAME}]
    ,[${UsersTable.COL_PASSWORD}]
    ,[${UsersTable.COL_ROLE}]
    ,[${UsersTable.COL_HIGHSCORE}]
    ,[${UsersTable.COL_PASSWORD_CHANGED_AT}]
    ,[${UsersTable.COL_PASSWORD_RESET_TOKEN}]
    ,[${UsersTable.COL_PASSWORD_RESET_EXPIRES}]
  FROM [QuizApp].[dbo].[users] 
  WHERE ${key} = '${value}'`;

    const pool = await dbClient.getConnection(config.sql);

    const userFromDb = await pool.request().query(findUserByConditionQuery);

    if (!userFromDb.recordsets[0][0]) {
      throw new AppError("no user found", 400);
    }
    return { ...userFromDb.recordsets[0][0] };
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const checkIfEmailExists = async (email) => {
  try {
    const findUserByConditionQuery = `SELECT [_ID]
    ,[${UsersTable.COL_EMAIL}]
  FROM [QuizApp].[dbo].[users] 
  WHERE email = '${email}'`;

    const pool = await dbClient.getConnection(config.sql);

    let userFromDb = await pool.request().query(findUserByConditionQuery);
    userFromDb = { ...userFromDb.recordsets[0][0] };
    if (userFromDb.email) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const updateUserToken = async ({ id, token, expire }) => {
  try {
    const pool = await dbClient.getConnection(config.sql);

    const updateUserResetTokenQuery = `UPDATE [${config.sql.database}].[dbo].[${
      UsersTable.TABLE_NAME
    }]
              SET
              ${UsersTable.COL_PASSWORD_RESET_EXPIRES} = ${
      expire ? `'${expire}'` : null
    } ,
              ${UsersTable.COL_PASSWORD_RESET_TOKEN} = ${
      token ? `'${token}'` : null
    } 
              WHERE _ID = ${id}`;

    return await pool.request().query(updateUserResetTokenQuery);
  } catch (error) {
    console.log(error);
    throw new AppError(`Could not update user's token!`);
  }
};

const onCreate = catchAsync(async (req, res, next) => {
  const existsUserWithEmail = await checkIfEmailExists(req.userOBJ.email);

  if (existsUserWithEmail) {
    return next(new AppError("There is already user with this email!", 400));
  }

  const newUser = await signup({ user: req.userOBJ, jwt: true });

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
       [${UsersTable.COL_PASSWORD_RESET_TOKEN}],
       [${UsersTable.COL_ACTIVE}])
       VALUES( 
          @${UsersTable.COL_EMAIL} ,
          @${UsersTable.COL_USERNAME} ,
          @${UsersTable.COL_PASSWORD}, 
          @${UsersTable.COL_ROLE},
          @${UsersTable.COL_HIGHSCORE},
          @${UsersTable.COL_PASSWORD_CHANGED_AT},
          @${UsersTable.COL_PASSWORD_RESET_EXPIRES},
          @${UsersTable.COL_PASSWORD_RESET_TOKEN},
          @${UsersTable.COL_ACTIVE}
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
      .input(UsersTable.COL_ACTIVE, dbClient.sql.TinyInt, user.getActive())
      .output()
      .query(newUserQuery)
      .catch((err) => {
        throw new AppError("Error with DB! (No data or connection error)");
      });
    let token;
    if (jwt === true) {
      token = signToken(newUser.recordsets[0][0].id);
    }

    const message = `
    <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Welcome To Quiz App 😃⭐</h1>
    <p>  <strong>It's good to see you here ${user.username}!</strong></p>
   `;

    await sendEmail({
      email: user.email,
      subject: "Welcome To - QuizApp 😃🎆⭐🎈",
      message,
    }).catch((err) => console.log(err));

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

  userFromDb = await getUserByCondition(UsersTable.COL_EMAIL, email);

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

  createSendToken(currentUser, 200, res);
});

const forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body || !req.body.email) {
    return next(new AppError("Please provide email to reset password!", 401));
  }

  const user = await getUserByCondition(UsersTable.COL_EMAIL, req.body.email);

  const currentUser = new User(
    user.email,
    user.username,
    user.password,
    user.role,
    user._ID,
    user.passwordChangedAt,
    user.passwordResetToken,
    user.passwordResetExpires
  );

  if (!user) {
    return next(new AppError("There is no user with this email address!", 404));
  }
  const resetToken = await currentUser.createPasswordResetToken();

  await updateUserToken({
    id: currentUser.id,
    token: currentUser.getPasswordResetToken(),
    expire: new Date(currentUser.getPasswordResetExpires()).toISOString(),
  });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `
  <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Forgot your password?</h1>
  <p>Go to - ${resetURL} .</p>
  <strong>If you didn't please ignore this email!</strong>
 `;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "Your password reset token - QuizApp",
      resetToken,
      message,
    }).catch((err) => console.log(err));
    res.status(200).json({
      status: "success",
      message: `Reset instructions was sent to ${req.body.email}!`,
    });
  } catch (err) {
    await updateUserToken({ id: currentUser.id, token: null, expire: null });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const payload = jwtSimple.decode(req.params.token, config.jwtSecret);

  const user = await getUserByCondition(UsersTable.COL_EMAIL, payload.email);

  const currentUser = new User(
    user.email,
    user.username,
    user.password,
    user.role,
    user._ID,
    user.passwordChangedAt,
    user.passwordResetToken,
    user.passwordResetExpires
  );

  const expirationTime = Date.parse(currentUser.getPasswordResetExpires());
  const now = Date.now();
  if (now > expirationTime) {
    return next(new AppError("Token is invalid, or has expired.", 400));
  }

  const updateUserQuery = `UPDATE [${config.sql.database}].[dbo].[${
    UsersTable.TABLE_NAME
  }]
              SET
              ${UsersTable.COL_PASSWORD_RESET_TOKEN} = null ,
              ${UsersTable.COL_PASSWORD_RESET_EXPIRES} = null ,
              ${UsersTable.COL_PASSWORD} = '${await bcrypt.hash(
    req.body.password,
    12
  )}' 
              WHERE _ID = ${currentUser.getId()}`;

  const pool = await dbClient.getConnection(config.sql);

  await pool.request().query(updateUserQuery);

  createSendToken(currentUser, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const userFromDb = await getUserByCondition("_ID", req.user.id);
  const now = Date.now();
  if (
    !req.body ||
    !req.body.email ||
    !req.body.password ||
    !req.body.newPassword
  ) {
    return next(
      new AppError(
        "To update user password you must send - Email, Current password & New Password",
        401
      )
    );
  }

  const currentUser = new User(
    userFromDb.email,
    userFromDb.username,
    userFromDb.password,
    userFromDb.role,
    userFromDb._ID,
    userFromDb.passwordChangedAt
  );

  const passwordIsCorrect = await currentUser.checkPassword(
    req.body.password,
    currentUser.getPassword()
  );

  if (!passwordIsCorrect) {
    return next(new AppError("Your current password is wrong", 401));
  }

  currentUser.setPasswordChangedAt(now);

  const updateUserQuery = `UPDATE [${config.sql.database}].[dbo].[${
    UsersTable.TABLE_NAME
  }]
              SET
              ${
                UsersTable.COL_PASSWORD_CHANGED_AT
              } = '${new Date().toISOString()}' ,
              ${UsersTable.COL_PASSWORD} = '${await bcrypt.hash(
    req.body.newPassword,
    12
  )}' 
              WHERE _ID = ${currentUser.getId()}`;
  const pool = await dbClient.getConnection(config.sql);
  await pool.request().query(updateUserQuery);

  const token = signToken(currentUser.getId());

  res.status(201).json({
    status: "success",
    token,
    data: {
      currentUser,
    },
  });
});

module.exports = {
  onCreate,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
};
