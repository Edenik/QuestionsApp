const config = require("../../config");
const {
  checkAnswerQuery,
  selectTop5QuestionsByDifficulityQuery,
} = require("../../data/questions/questionsQueries");
const catchAsync = require("../../utils/catchAsync");
const dbClient = require("../../utils/dbClient");
const AppError = require("../../utils/appError");

const getQuestionsWithDifficulity = catchAsync(async (req, res, next) => {
  const difficulity = req.query.difficulity;

  if (difficulity == undefined || !/(easy|medium|hard)/.test(difficulity)) {
    return next(
      new AppError("Add difficulity as query: difficulity?=easy|medium|hard")
    );
  }

  const pool = await dbClient.getConnection(config.sql);
  const questions = await pool
    .request()
    .query(selectTop5QuestionsByDifficulityQuery(difficulity));

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

const checkAnswer = catchAsync(async (req, res, next) => {
  const question = req.query.question;
  const answer = req.query.answer;

  if (question == undefined || answer == undefined) {
    return next(new AppError("You must enter question and answer number."));
  }

  const pool = await dbClient.getConnection(config.sql);
  const questionFromDb = await pool
    .request()
    .query(checkAnswerQuery({ question, answer }));

  if (questionFromDb.recordsets[0].length == 0) {
    return next(new AppError("No question found or answer isn't correct."));
  }

  res.status(200).json({
    status: "success",
    data: "correct",
  });
});

module.exports = {
  getQuestionsWithDifficulity,
  checkAnswer,
};
