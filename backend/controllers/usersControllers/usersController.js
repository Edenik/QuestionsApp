const config = require("../../config");
const UsersTable = require("../../data/users/usersTable");
const User = require("../../models/userModel");
const catchAsync = require("../../utils/catchAsync");
const dbClient = require("../../utils/dbClient");
const filterObj = require("../../utils/filterObj");
const AppError = require("../../utils/appError");

const getCurrentUser = async (id, next) => {
  try {
    const pool = await dbClient.getConnection(config.sql);
    const getUserQuery = `SELECT 
  [_ID]
      ,[${UsersTable.COL_EMAIL}]
      ,[${UsersTable.COL_USERNAME}]
      ,[${UsersTable.COL_ROLE}]
      ,[${UsersTable.COL_HIGHSCORE}]
      ,[${UsersTable.COL_ACTIVE}]
            FROM [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]
            WHERE _ID = ${id}`;

    const currentUser = await pool
      .request()
      .query(getUserQuery)
      .catch(() => {
        next(new AppError("Error with DB! (No data or connection error)"));
      });

    return currentUser.recordsets[0][0];
  } catch (err) {
    return next(new AppError("Error with DB! (No data or connection error)"));
  }
};

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.newPassword) {
    return next(new AppError("This route is not for password updates!", 400));
  }

  if (!req.body.username || !req.body.email) {
    return next(
      new AppError("To update user you must include email and username!", 400)
    );
  }

  const filteredBody = filterObj(req.body, "username", "email");

  const currentUser = new User(
    filteredBody.email,
    filteredBody.username,
    req.user.password,
    req.user.role,
    req.user.highscore,
    req.user.id
  );

  const updateUserQuery = `UPDATE [${config.sql.database}].[dbo].[${
    UsersTable.TABLE_NAME
  }]
              SET
              ${UsersTable.COL_EMAIL} = '${currentUser.getEmail()}' ,
              ${UsersTable.COL_USERNAME} = '${currentUser.getUsername()}' 
              WHERE _ID = ${req.user.id}`;
  const pool = await dbClient.getConnection(config.sql);

  await pool.request().query(updateUserQuery);

  res.status(201).json({
    status: "success",
    data: {
      user: currentUser,
    },
  });
});

const onDeActivateMe = catchAsync(async (req, res, next) => {
  const currentUser = await getCurrentUser(req.user.id, next);

  if (currentUser.active == 0) {
    return next(new AppError("User deactivated already", 400));
  }

  const updateUserQuery = `UPDATE [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]
              SET
              ${UsersTable.COL_ACTIVE} = '0' 
              WHERE _ID = ${req.user.id}`;
  const pool = await dbClient.getConnection(config.sql);

  await pool.request().query(updateUserQuery);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

const onActivateMe = catchAsync(async (req, res, next) => {
  const currentUser = await getCurrentUser(req.user.id, next);

  if (currentUser.active == 1) {
    return next(new AppError("User activated already", 400));
  }

  currentUser.active = 1;

  const updateUserQuery = `UPDATE [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]
              SET
              ${UsersTable.COL_ACTIVE} = '1' 
              WHERE _ID = ${req.user.id}`;

  const pool = await dbClient.getConnection(config.sql);

  await pool.request().query(updateUserQuery);

  res.status(200).json({
    status: "success",
    data: currentUser,
  });
});

const getMe = catchAsync(async (req, res, next) => {
  const user = await getCurrentUser(req.user.id, next);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

module.exports = {
  getMe,
  updateMe,
  onActivateMe,
  onDeActivateMe,
};
