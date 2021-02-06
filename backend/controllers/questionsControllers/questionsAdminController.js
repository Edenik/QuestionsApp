const config = require("../../config");
const Question = require("../../models/questionModel");
const QuestionsTable = require("../../data/questions/questionsTable");
const questionsQueries = require("../../data/questions/questionsQueries");
const catchAsync = require("../../utils/catchAsync");
const dbClient = require("../../utils/dbClient");
const AppError = require("../../utils/appError");

const getQuestions = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);
  const questions = await pool
    .request()
    .query(questionsQueries.selectAllFromQuestionsQuery);
  res.status(200).json({
    status: "success",
    data: {
      questions: questions.recordsets[0],
    },
  });
});

const getQuestion = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);

  const question = await pool
    .request()
    .query(questionsQueries.selectQuestionWhereIdQuery(req.params.id));

  if (question.recordsets[0].length == 0) {
    return next(new AppError("No question found with that id"));
  }

  delete req.user;

  res.status(200).json({
    status: "success",
    user: req.user,
    data: {
      question: question.recordsets[0],
    },
  });
});

const onCreate = catchAsync(async (req, res, next) => {
  const newQuestionId = await createQuestion(req.questionOBJ);

  if (newQuestionId.status === "error") {
    next(new AppError(newQuestionId.message));
  }

  res.status(201).json({
    status: "success",
    data: {
      newQuestionId,
    },
  });
});

const createQuestion = async (question) => {
  try {
    const pool = await dbClient.getConnection(config.sql);
    const newQuestion = await pool
      .request()
      .input(
        QuestionsTable.COL_QUESTION,
        dbClient.sql.Text,
        question.getQuestion()
      )
      .input(
        QuestionsTable.COL_OPTION1,
        dbClient.sql.Text,
        question.getOption1()
      )
      .input(
        QuestionsTable.COL_OPTION2,
        dbClient.sql.Text,
        question.getOption2()
      )
      .input(
        QuestionsTable.COL_OPTION3,
        dbClient.sql.Text,
        question.getOption3()
      )
      .input(
        QuestionsTable.COL_DIFFICULITY,
        dbClient.sql.Text,
        question.getDifficulity()
      )
      .input(
        QuestionsTable.COL_CORRECT_ANSWER,
        dbClient.sql.Int,
        question.getCorrectAnswer()
      )
      .output()
      .query(questionsQueries.newQuestionQuery)
      .catch((err) => {
        throw new Error("Error with DB! (No data or connection error)");
      });

    return newQuestion.recordsets[0][0]["id"];
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const onUpdate = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);

  const questionOBJ = { ...req.questionOBJ };
  const newQuestion = new Question(
    questionOBJ.question,
    questionOBJ.option1,
    questionOBJ.option2,
    questionOBJ.option3,
    questionOBJ.difficulity,
    questionOBJ.correctAnswer,
    questionOBJ.id
  );

  await pool.request().query(questionsQueries.updateQuestionQuery(newQuestion));

  res.status(201).json({
    status: "success",
    data: {
      qustion: newQuestion,
    },
  });
});

const onDelete = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);

  const deleteRes = await pool
    .request()
    .query(questionsQueries.deleteQuestionQuery(req.params.id));

  if (deleteRes.rowsAffected[0] == 0) {
    return next(new AppError("No question found to delete."));
  }
  res.status(200).json({
    status: "success",
    data: {
      result: `ID: ${req.params.id} Deleted`,
    },
  });
});

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  onCreate,
  onUpdate,
  onDelete,
};
