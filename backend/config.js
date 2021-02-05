const dotenv = require("dotenv");

dotenv.config();

const {
  PORT,
  SQL_USER,
  SQL_PASSWORD,
  SQL_DATABASE,
  SQL_SERVER,
  SQL_PORT,
  SQL_INSTANCE_NAME,
  ADMIN_EMAIL,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  TEST_EMAIL,
  TEST_USERNAME,
  TEST_PASSWORD,
  JWT_SECRET,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  NODE_ENV,
} = process.env;

module.exports = {
  port: PORT,
  jwtSecret: JWT_SECRET,
  nodeEnvironment: NODE_ENV,
  sql: {
    user: SQL_USER,
    password: SQL_PASSWORD,
    server: SQL_SERVER,
    database: SQL_DATABASE,
    options: {
      trustedConnection: true,
      enableArithAbort: true,
      instancename: SQL_INSTANCE_NAME,
    },
    port: SQL_PORT * 1,
  },
  adminUser: {
    ADMIN_EMAIL,
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
  },
  testUser: {
    TEST_EMAIL,
    TEST_USERNAME,
    TEST_PASSWORD,
  },
  nodemailer: {
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
  },
};
