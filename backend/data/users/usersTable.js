class UsersTable {
  static TABLE_NAME = "users";
  static COL_EMAIL = "email";
  static COL_USERNAME = "username";
  static COL_PASSWORD = "password";
  static COL_ROLE = "role";
  static COL_HIGHSCORE = "highscore";
  static COL_PASSWORD_CHANGED_AT = "passwordChangedAt";
  static COL_PASSWORD_RESET_TOKEN = "passwordResetToken";
  static COL_PASSWORD_RESET_EXPIRES = "passwordResetExpires";
}

module.exports = UsersTable;
