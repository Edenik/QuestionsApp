const config = require("../../config");
const QuestionsTable = require("../../data/questions/questionsTable");
const catchAsync = require("../../utils/catchAsync");
const dbClient = require("../../utils/dbClient");
const AppError = require("../../utils/appError");

const getQuestionsWithDifficulity = catchAsync(async (req, res, next) => {
  const difficulity = req.query.difficulity;

  if (difficulity == undefined || !/(easy|medium|high)/.test(difficulity)) {
    return next(
      new AppError("Add difficulity as query: difficulity?=easy|medium|high")
    );
  }

  const pool = await dbClient.getConnection(config.sql);

  const getQuestionsQuery = `SELECT TOP 5 
  [_ID]
    ,[${QuestionsTable.COL_QUESTION}]
    ,[${QuestionsTable.COL_OPTION1}]
    ,[${QuestionsTable.COL_OPTION2}]
    ,[${QuestionsTable.COL_OPTION3}]
    ,[${QuestionsTable.COL_DIFFICULITY}]
        FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}]
        WHERE difficulity = '${difficulity}' ORDER BY NEWID()`;
  const questions = await pool.request().query(getQuestionsQuery);
  if (questions.recordsets[0].length == 0) {
    return next(new AppError("No questions found."));
  }

  res.json({
    status: "success",
    data: {
      questions: questions.recordsets[0],
    },
  });
});

module.exports = {
  getQuestionsWithDifficulity,
};
