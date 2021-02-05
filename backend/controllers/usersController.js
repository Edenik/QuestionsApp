const config = require("../config");
const UsersTable = require("../data/users/usersTable");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const dbClient = require("../utils/dbClient");
const filterObj = require("../utils/filterObj");
const bcrypt = require("bcryptjs");
const authController = require("./authController");
const AppError = require("../utils/appError");

const getUsers = catchAsync(async (req, res, next) => {
  // try {
  const pool = await dbClient.getConnection(config.sql);
  const getUsersQuery = `SELECT [_ID]
    ,[${UsersTable.COL_EMAIL}]
    ,[${UsersTable.COL_USERNAME}]
    ,[${UsersTable.COL_ROLE}]
    ,[${UsersTable.COL_HIGHSCORE}]
    ,[${UsersTable.COL_PASSWORD_CHANGED_AT}]
           FROM [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]`;
  const users = await pool
    .request()
    .query(getUsersQuery)
    .catch(() => {
      next(new AppError("Error with DB! (No data or connection error)"));
    });

  if (users.recordsets[0].length == 0) {
    next(new AppError("No users found on database"));
  }
  res.status(200).json({
    status: "success",
    data: {
      users: users.recordsets[0],
    },
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);
  const getUserQuery = `SELECT * 
            FROM [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]
            WHERE _ID = ${req.params.id}`;

  const user = await pool
    .request()
    .query(getUserQuery)
    .catch(() => {
      next(new AppError("Error with DB! (No data or connection error)"));
    });
  if (user.recordsets[0].length == 0) {
    next(new AppError("No user found with that id"));
  }
  res.status(200).json({
    status: "success",
    data: {
      user: user.recordsets[0],
    },
  });
});

const onUpdate = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);

  const userOBJ = { ...req.body.userOBJ };
  const user = new User(
    userOBJ.email,
    userOBJ.username,
    userOBJ.password,
    userOBJ.role,
    userOBJ.highscore,
    userOBJ.id
  );

  const updateUserQuery = `UPDATE [${config.sql.database}].[dbo].[${
    UsersTable.TABLE_NAME
  }]
              SET
              ${UsersTable.COL_EMAIL} = '${user.getEmail()}' ,
              ${UsersTable.COL_USERNAME} = '${user.getUsername()}' ,
              ${
                UsersTable.COL_PASSWORD_CHANGED_AT
              } = '${new Date().toISOString()}' ,
              ${UsersTable.COL_PASSWORD} = '${await bcrypt.hash(
    user.getPassword(),
    12
  )}' ,
              ${UsersTable.COL_ROLE} = '${user.getRole()}' ,
              ${UsersTable.COL_HIGHSCORE} = '${user.getHighscore()}' 
              WHERE _ID = ${user.getId()}`;

  await pool.request().query(updateUserQuery);

  res.status(201).json({
    status: "success",
    data: {
      email: userOBJ.email,
      username: userOBJ.username,
      role: userOBJ.role,
      highscore: userOBJ.highscore,
      id: userOBJ.id,
    },
  });
});

const onDelete = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);
  const deleteUserQuery = `DELETE FROM [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}] 
            WHERE _ID = ${req.params.id}`;
  const ress = await pool.request().query(deleteUserQuery);

  if (ress.rowsAffected[0] == 0) {
    return next(new AppError("No user found to delete."));
  }
  res.status(200).json({
    status: "success",
    data: {
      result: `ID: ${req.params.id} Deleted`,
      ress,
    },
  });
});

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

module.exports = {
  getUsers,
  getUser,
  onUpdate,
  onDelete,
  updateMe,
};
