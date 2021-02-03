const User = require("../../models/userModel");
const config = require("../../config");

const { adminUser, testUser } = config;
exports.usersData = [
  new User(
    adminUser.ADMIN_EMAIL,
    adminUser.ADMIN_USERNAME,
    adminUser.ADMIN_PASSWORD,
    "admin"
  ),
  new User(testUser.TEST_EMAIL, testUser.TEST_USERNAME, testUser.TEST_PASSWORD),
];
