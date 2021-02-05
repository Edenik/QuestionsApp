const config = require("../../config");
const UsersTable = require("../../data/users/usersTable");
const User = require("../../models/userModel");
const catchAsync = require("../../utils/catchAsync");
const dbClient = require("../../utils/dbClient");
const filterObj = require("../../utils/filterObj");
const bcrypt = require("bcryptjs");
const authController = require("./authController");
const AppError = require("../../utils/appError");

const getUsers = catchAsync(async (req, res, next) => {
  const active = req.query.active;
  if (active !== undefined && active > 1) {
    return next(
      new AppError(
        "Try querying this route with: ?active=0 (unactive users) or ?active=1 (active users)"
      )
    );
  }
  const pool = await dbClient.getConnection(config.sql);
  const getUsersQuery = `SELECT *
           FROM [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]
           ${
             active !== undefined
               ? `WHERE ${UsersTable.COL_ACTIVE} = ${active}`
               : ""
           }
           `;

  console.log(getUsersQuery);
  const users = await pool
    .request()
    .query(getUsersQuery)
    .catch((err) => {
      console.log(err);
      next(new AppError("Error with DB! (No data or connection error)"));
    });

  if (users.recordsets[0].length == 0) {
    return next(new AppError("No users found"));
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
      user: user.recordsets[0][0],
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

module.exports = {
  getUsers,
  getUser,
  onUpdate,
  onDelete,
};
