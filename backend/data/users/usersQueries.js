const config = require("../../config");
const UsersTable = require("./usersTable");

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

const removeTableQuery = (force) =>
  `DROP TABLE ${force === true ? "IF EXISTS" : ""} ${UsersTable.TABLE_NAME}`;

const findUserByConditionQuery = ({ key, value }) => `SELECT [_ID]
  ,[${UsersTable.COL_EMAIL}]
  ,[${UsersTable.COL_USERNAME}]
  ,[${UsersTable.COL_PASSWORD}]
  ,[${UsersTable.COL_ROLE}]
  ,[${UsersTable.COL_HIGHSCORE}]
  ,[${UsersTable.COL_PASSWORD_CHANGED_AT}]
  ,[${UsersTable.COL_PASSWORD_RESET_TOKEN}]
  ,[${UsersTable.COL_PASSWORD_RESET_EXPIRES}]
FROM [QuizApp].[dbo].[users] 
WHERE ${key} = '${value}'`;

const checkIfEmailExistsQuery = (email) => `SELECT [_ID]
,[${UsersTable.COL_EMAIL}]
FROM [QuizApp].[dbo].[users] 
WHERE email = '${email}'`;

const updateUserResetTokenQuery = ({ id, token, expire }) => `UPDATE [${
  config.sql.database
}].[dbo].[${UsersTable.TABLE_NAME}]
            SET
            ${UsersTable.COL_PASSWORD_RESET_EXPIRES} = ${
  expire ? `'${expire}'` : null
} ,
            ${UsersTable.COL_PASSWORD_RESET_TOKEN} = ${
  token ? `'${token}'` : null
} 
            WHERE _ID = ${id}`;

const newUserQuery = `INSERT INTO [dbo].[${UsersTable.TABLE_NAME}]
            ([${UsersTable.COL_EMAIL}], 
              [${UsersTable.COL_USERNAME}], 
               [${UsersTable.COL_PASSWORD}], 
               [${UsersTable.COL_ROLE}], 
               [${UsersTable.COL_HIGHSCORE}],
               [${UsersTable.COL_PASSWORD_CHANGED_AT}],
               [${UsersTable.COL_PASSWORD_RESET_EXPIRES}],
               [${UsersTable.COL_PASSWORD_RESET_TOKEN}],
               [${UsersTable.COL_ACTIVE}])
               VALUES( 
                  @${UsersTable.COL_EMAIL} ,
                  @${UsersTable.COL_USERNAME} ,
                  @${UsersTable.COL_PASSWORD}, 
                  @${UsersTable.COL_ROLE},
                  @${UsersTable.COL_HIGHSCORE},
                  @${UsersTable.COL_PASSWORD_CHANGED_AT},
                  @${UsersTable.COL_PASSWORD_RESET_EXPIRES},
                  @${UsersTable.COL_PASSWORD_RESET_TOKEN},
                  @${UsersTable.COL_ACTIVE}
                 ); SELECT SCOPE_IDENTITY() AS id;`;
module.exports = {
  createTableQuery,
  removeTableQuery,
  findUserByConditionQuery,
  updateUserResetTokenQuery,
  newUserQuery,
};
