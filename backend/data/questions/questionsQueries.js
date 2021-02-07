const config = require("../../config");
const QuestionsTable = require("./questionsTable");

const selectAllFromQuestionsQuery = `SELECT [${QuestionsTable.COL_QUESTION}], 
[${QuestionsTable.COL_OPTION1}], 
[${QuestionsTable.COL_OPTION2}], 
[${QuestionsTable.COL_OPTION3}], 
[${QuestionsTable.COL_DIFFICULITY}], 
[${QuestionsTable.COL_CORRECT_ANSWER}]  ,
[_ID] AS id
FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}]
`;

const selectAllFromQuestionsPaginatingQuery = ({
  skip,
  limit,
}) => `SELECT [${QuestionsTable.COL_QUESTION}], 
[${QuestionsTable.COL_OPTION1}], 
[${QuestionsTable.COL_OPTION2}], 
[${QuestionsTable.COL_OPTION3}], 
[${QuestionsTable.COL_DIFFICULITY}], 
[${QuestionsTable.COL_CORRECT_ANSWER}]  ,
[_ID] AS id
FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}]
ORDER BY [_ID] ASC
OFFSET ${skip} ROWS FETCH NEXT ${limit} ROWS ONLY
`;

const countQuestionsQuery = `SELECT COUNT (*)
FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}]`;

const selectQuestionWhereIdQuery = (id) => `SELECT * 
FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}]
WHERE _ID = ${id}`;

const newQuestionQuery = `INSERT INTO [dbo].[${QuestionsTable.TABLE_NAME}]
([${QuestionsTable.COL_QUESTION}], 
   [${QuestionsTable.COL_OPTION1}], 
   [${QuestionsTable.COL_OPTION2}], 
   [${QuestionsTable.COL_OPTION3}], 
   [${QuestionsTable.COL_DIFFICULITY}], 
   [${QuestionsTable.COL_CORRECT_ANSWER}])  
   VALUES ( 
     @${QuestionsTable.COL_QUESTION},
      @${QuestionsTable.COL_OPTION1}, 
      @${QuestionsTable.COL_OPTION2},
      @${QuestionsTable.COL_OPTION3},
      @${QuestionsTable.COL_DIFFICULITY},
      @${QuestionsTable.COL_CORRECT_ANSWER}
     ); SELECT SCOPE_IDENTITY() AS id;`;

const updateQuestionQuery = (question) => `UPDATE [${
  config.sql.database
}].[dbo].[${QuestionsTable.TABLE_NAME}]
                  SET
                  ${QuestionsTable.COL_QUESTION} = '${question.getQuestion()}' ,
                  ${QuestionsTable.COL_OPTION1} = '${question.getOption1()}' ,
                  ${QuestionsTable.COL_OPTION2} = '${question.getOption2()}' ,
                  ${QuestionsTable.COL_OPTION3} = '${question.getOption3()}' ,
                  ${
                    QuestionsTable.COL_DIFFICULITY
                  } = '${question.getDifficulity()}' ,
                  ${
                    QuestionsTable.COL_CORRECT_ANSWER
                  } = '${question.getCorrectAnswer()}'
                  WHERE _ID = ${question.getId()}`;

const deleteQuestionQuery = (
  id
) => `DELETE FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}] 
                  WHERE _ID = ${id}`;

const checkAnswerQuery = ({ question, answer }) => `SELECT 
                  [_ID] AS id
                  ,[correctAnswer]
                            FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}]
                            WHERE _ID = ${question} AND ${QuestionsTable.COL_CORRECT_ANSWER} = ${answer}`;

const selectTop5QuestionsByDifficulityQuery = (difficulity) => `SELECT TOP 5 
[_ID] AS id
  ,[${QuestionsTable.COL_QUESTION}]
  ,[${QuestionsTable.COL_OPTION1}]
  ,[${QuestionsTable.COL_OPTION2}]
  ,[${QuestionsTable.COL_OPTION3}]
  ,[${QuestionsTable.COL_DIFFICULITY}]
      FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}]
      WHERE difficulity = '${difficulity}' ORDER BY NEWID()`;

const createTableQuery = `CREATE TABLE ${QuestionsTable.TABLE_NAME} 
      (_ID INT PRIMARY KEY IDENTITY(1,1), 
      ${QuestionsTable.COL_QUESTION} VARCHAR(1000) NOT NULL, 
      ${QuestionsTable.COL_OPTION1} VARCHAR(500) NOT NULL, 
      ${QuestionsTable.COL_OPTION2} VARCHAR(500) NOT NULL, 
      ${QuestionsTable.COL_OPTION3} VARCHAR(500) NOT NULL, 
      ${QuestionsTable.COL_DIFFICULITY} VARCHAR(500) NOT NULL, 
      ${QuestionsTable.COL_CORRECT_ANSWER} INT NOT NULL)`;

const removeTableQuery = (force) =>
  `DROP TABLE ${force === true ? "IF EXISTS" : ""} ${
    QuestionsTable.TABLE_NAME
  }`;

module.exports = {
  selectAllFromQuestionsQuery,
  selectAllFromQuestionsPaginatingQuery,
  selectQuestionWhereIdQuery,
  newQuestionQuery,
  updateQuestionQuery,
  deleteQuestionQuery,
  checkAnswerQuery,
  selectTop5QuestionsByDifficulityQuery,
  createTableQuery,
  removeTableQuery,
  countQuestionsQuery,
};
