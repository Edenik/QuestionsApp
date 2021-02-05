const config = require("../../config");
const UsersTable = require("../../data/users/usersTable");
const authController = require("../usersControllers/authController");
const usersData = require("../../data/users/usersData");
const dbClient = require("../../utils/dbClient");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

const addUsersToDb = async () => {
  try {
    const responses = [];
    for (const user of usersData.usersData) {
      await authController.signup({ user, jwt: false });
      responses.push(user);
    }
    return responses;
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const onCreate = catchAsync(async (req, res, next) => {
  const users = await createUsersTableWithData();
  res.json({
    status: "success",
    data: {
      database: config.sql.database,
      table: UsersTable.TABLE_NAME,
      users: users.length,
    },
  });
});

const createUsersTableWithData = async () => {
  try {
    const pool = await dbClient.getConnection(config.sql);
    const createTableQuery = `CREATE TABLE ${UsersTable.TABLE_NAME} 
            (_ID INT PRIMARY KEY IDENTITY(1,1), 
            ${UsersTable.COL_EMAIL} VARCHAR(70) NOT NULL, 
            ${UsersTable.COL_USERNAME} VARCHAR(20) NOT NULL, 
            ${UsersTable.COL_PASSWORD} VARCHAR(60) NOT NULL, 
            ${UsersTable.COL_ROLE} VARCHAR(5) NOT NULL, 
            ${UsersTable.COL_HIGHSCORE} INT NOT NULL,
            ${UsersTable.COL_PASSWORD_CHANGED_AT} DATETIME NULL,
            ${UsersTable.COL_PASSWORD_RESET_TOKEN} VARCHAR(150) NULL,
            ${UsersTable.COL_PASSWORD_RESET_EXPIRES} DATETIME NULL,
            ${UsersTable.COL_ACTIVE} TINYINT NOT NULL
            )`;
    // UNIQUE KEY unique_email (${UsersTable.COL_EMAIL})
    // UNIQUE KEY( ${UsersTable.COL_EMAIL})
    await pool
      .request()
      .query(createTableQuery)
      .catch((err) => {
        console.log(err.message);
        throw new AppError(
          `Table ${UsersTable.TABLE_NAME} already created!`,
          400
        );
      });
    const users = await addUsersToDb();
    return users;
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const onUpgrade = async (req, res, next) => {
  try {
    await deleteUsersTable({ force: true });
    const users = await createUsersTableWithData();

    res.json({
      status: "success",
      data: {
        database: config.sql.database,
        table: UsersTable.TABLE_NAME,
        users: users.length,
      },
    });
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const onDelete = catchAsync(async (req, res, next) => {
  await deleteUsersTable({ force: false });
  res.json({
    status: "success",
    data: { message: `Table ${UsersTable.TABLE_NAME} Deleted` },
  });
});

const deleteUsersTable = async ({ force }) => {
  try {
    const pool = await dbClient.getConnection(config.sql);
    const removeTableQuery = `DROP TABLE ${force === true ? "IF EXISTS" : ""} ${
      UsersTable.TABLE_NAME
    }`;

    return await pool.request().query(removeTableQuery);
  } catch (err) {
    throw new AppError("Error with DB! (No data or connection error)", 400);
  }
};

module.exports = { onCreate, onDelete, onUpgrade };
