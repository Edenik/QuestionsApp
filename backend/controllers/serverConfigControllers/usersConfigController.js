const config = require("../../config");
const UsersTable = require("../../data/users/usersTable");
const {
  createTableQuery,
  removeTableQuery,
} = require("../../data/users/usersQueries");
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
    await pool
      .request()
      .query(createTableQuery)
      .catch((err) => {
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

    return await pool.request().query(removeTableQuery(force));
  } catch (err) {
    throw new AppError("Error with DB! (No data or connection error)", 400);
  }
};

module.exports = { onCreate, onDelete, onUpgrade };
