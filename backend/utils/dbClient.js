const sql = require("mssql");
const AppError = require("./appError");

let pool = null;

const closePool = async () => {
  console.log("closing pool");
  try {
    await pool.close();
    pool = null;
  } catch (err) {
    pool = null;
    console.log(err);
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
