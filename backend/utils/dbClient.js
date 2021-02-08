const sql = require("mssql");
const AppError = require("./appError");

let pool = null;

const closePool = async () => {
  try {
    await pool.close();
    pool = null;
  } catch (err) {
    pool = null;
  }
};

const getConnection = async (config) => {
  try {
    if (pool) {
      return pool;
    }
    pool = await sql.connect(config);
    pool.on("error", async (err) => {
      await closePool();
      throw new AppError(err);
    });
    return pool;
  } catch (err) {
    pool = null;
    throw new AppError(err);
  }
};

module.exports = { getConnection, sql };
