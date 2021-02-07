const bcrypt = require("bcryptjs");
const config = require("../../config");
const UsersTable = require("./usersTable");

const createTableQuery = `CREATE TABLE ${UsersTable.TABLE_NAME} 
(_ID INT PRIMARY KEY IDENTITY(1,1), 
${UsersTable.COL_EMAIL} VARCHAR(70) UNIQUE NOT NULL, 
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

const findUserByConditionQuery = ({ key, value }) => `SELECT [_ID] AS id
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

const checkIfEmailExistsQuery = (email) => `SELECT [_ID] AS id
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

const getUserByEmailQuery = `SELECT 
                 [_ID] AS id
                   ,[${UsersTable.COL_EMAIL}]
                   ,[${UsersTable.COL_USERNAME}]
                   ,[${UsersTable.COL_PASSWORD}]
                   ,[${UsersTable.COL_ROLE}]
                   ,[${UsersTable.COL_HIGHSCORE}]
                   ,[${UsersTable.COL_PASSWORD_CHANGED_AT}]
               FROM [QuizApp].[dbo].[users] 
               WHERE email =@email`;

const resetUserPasswordQuery = async (password, id) => `UPDATE [${
  config.sql.database
}].[dbo].[${UsersTable.TABLE_NAME}]
            SET
            ${UsersTable.COL_PASSWORD_RESET_TOKEN} = null ,
            ${UsersTable.COL_PASSWORD_RESET_EXPIRES} = null ,
            ${UsersTable.COL_PASSWORD} = '${await bcrypt.hash(password, 12)}' 
            WHERE _ID = ${id};`;

const updatePasswordQuery = async (password, id) => `UPDATE [${
  config.sql.database
}].[dbo].[${UsersTable.TABLE_NAME}]
                        SET
                        ${
                          UsersTable.COL_PASSWORD_CHANGED_AT
                        } = '${new Date().toISOString()}' ,
                        ${UsersTable.COL_PASSWORD} = '${await bcrypt.hash(
  password,
  12
)}' 
                        WHERE _ID = ${id}`;
const getActiveDeactiveUsers = (active) => `SELECT [_ID] AS id
,[${UsersTable.COL_EMAIL}]
,[${UsersTable.COL_USERNAME}]
,[${UsersTable.COL_ROLE}]
,[${UsersTable.COL_HIGHSCORE}]
,[${UsersTable.COL_PASSWORD_CHANGED_AT}]
,[${UsersTable.COL_PASSWORD_RESET_EXPIRES}]
FROM [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]
${active !== undefined ? `WHERE ${UsersTable.COL_ACTIVE} = ${active}` : ""}
`;

const getAllDataFromUser = (id) => `SELECT [_ID] AS id
,[${UsersTable.COL_EMAIL}]
,[${UsersTable.COL_USERNAME}]
,[${UsersTable.COL_ROLE}]
,[${UsersTable.COL_HIGHSCORE}]
,[${UsersTable.COL_PASSWORD_CHANGED_AT}]
,[${UsersTable.COL_PASSWORD_RESET_TOKEN}]
,[${UsersTable.COL_PASSWORD_RESET_EXPIRES}] 
FROM [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]
WHERE _ID = ${id}`;

const updateFullUserQuery = async (user) => `UPDATE [${
  config.sql.database
}].[dbo].[${UsersTable.TABLE_NAME}]
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

const deleteUserQuery = (
  id
) => `DELETE FROM [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}] 
            WHERE _ID = ${id}`;

const getUserDetailsWithOrWithoutPassword = (getPassword, id) => `SELECT 
            [_ID] AS id
                ,[${UsersTable.COL_EMAIL}]
                ,[${UsersTable.COL_USERNAME}]
                ,[${UsersTable.COL_ROLE}]
                ,[${UsersTable.COL_HIGHSCORE}]
                ,[${UsersTable.COL_ACTIVE}]
                ${getPassword === true ? `,[${UsersTable.COL_PASSWORD}]` : ``}
                      FROM [${config.sql.database}].[dbo].[${
  UsersTable.TABLE_NAME
}]
                      WHERE _ID = ${id}`;

const updateUserEmailAndNameQuery = (user) => `UPDATE [${
  config.sql.database
}].[dbo].[${UsersTable.TABLE_NAME}]
                                  SET
                                  ${
                                    UsersTable.COL_EMAIL
                                  } = '${user.getEmail()}' ,
                                  ${
                                    UsersTable.COL_USERNAME
                                  } = '${user.getUsername()}' 
                                  WHERE _ID = ${user.getId()}`;

const activateUserQuery = (
  activate,
  id
) => `UPDATE [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]
                                  SET
                                  ${UsersTable.COL_ACTIVE} = '${activate}' 
                                  WHERE _ID = ${id}`;

const getUserHighScores = `SELECT [_ID] AS id
,[${UsersTable.COL_EMAIL}]
,[${UsersTable.COL_USERNAME}]
,[${UsersTable.COL_ROLE}]
,[${UsersTable.COL_HIGHSCORE}]
FROM [QuizApp].[dbo].[users]
ORDER BY ${UsersTable.COL_HIGHSCORE} DESC`;

module.exports = {
  createTableQuery,
  removeTableQuery,
  findUserByConditionQuery,
  checkIfEmailExistsQuery,
  updateUserResetTokenQuery,
  newUserQuery,
  getUserByEmailQuery,
  resetUserPasswordQuery,
  updatePasswordQuery,
  getActiveDeactiveUsers,
  getAllDataFromUser,
  updateFullUserQuery,
  deleteUserQuery,
  getUserDetailsWithOrWithoutPassword,
  updateUserEmailAndNameQuery,
  activateUserQuery,
  getUserHighScores,
};
