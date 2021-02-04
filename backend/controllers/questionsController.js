const config = require("../config");
const QuestionsTable = require("../data/questions/questionsTable");
const Question = require("../models/questionModel");
const catchAsync = require("../utils/catchAsync");
const dbClient = require("../utils/dbClient");
const AppError = require("../utils/appError");

const getQuestions = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);
  const getQuestionsQuery = `SELECT * 
         FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}]`;
  const questions = await pool.request().query(getQuestionsQuery);
  res.status(200).json({
    status: "success",
    data: {
      questions: questions.recordsets[0],
    },
  });
});

const getQuestion = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);
  const getQuestionQuery = `SELECT * 
            FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}]
            WHERE _ID = ${req.params.id}`;

  const question = await pool.request().query(getQuestionQuery);

  if (question.recordsets[0].length == 0) {
    return next(new AppError("No question found with that id"));
  }
  console.log(req);
  res.status(200).json({
    status: "success",
    user: req.user,
    data: {
      question: question.recordsets[0],
    },
  });
});

const getQuestionsWithDifficulity = catchAsync(async (req, res, next) => {
  const difficulity = "easy";
  const pool = await dbClient.getConnection(config.sql);

  const getQuestionsQuery = `SELECT TOP 5 *
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

const onCreate = catchAsync(async (req, res, next) => {
  const newQuestionId = await createQuestion(req.body.questionOBJ);

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
    const newQuestionQuery = `INSERT INTO [dbo].[${QuestionsTable.TABLE_NAME}]
    ([${QuestionsTable.COL_QUESTION}], 
       [${QuestionsTable.COL_OPTION1}], 
       [${QuestionsTable.COL_OPTION2}], 
       [${QuestionsTable.COL_OPTION3}], 
       [${QuestionsTable.COL_DIFFICULITY}], 
       [${QuestionsTable.COL_CORRECT_ANSWER}])  
       VALUES ( 
         @${QuestionsTable.COL_QUESTION} ,
          @${QuestionsTable.COL_OPTION1}, 
          @${QuestionsTable.COL_OPTION2},
          @${QuestionsTable.COL_OPTION3},
          @${QuestionsTable.COL_DIFFICULITY},
          @${QuestionsTable.COL_CORRECT_ANSWER}
         ); SELECT SCOPE_IDENTITY() AS id;`;

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
      .query(newQuestionQuery)
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

  const questionOBJ = { ...req.body.questionOBJ };
  const question = new Question(
    questionOBJ.question,
    questionOBJ.option1,
    questionOBJ.option2,
    questionOBJ.option3,
    questionOBJ.difficulity,
    questionOBJ.correctAnswer,
    questionOBJ.id
  );

  const updateQuestionQuery = `UPDATE [${config.sql.database}].[dbo].[${
    QuestionsTable.TABLE_NAME
  }]
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

  await pool.request().query(updateQuestionQuery);

  res.status(201).json({
    status: "success",
    data: {
      questionOBJ,
    },
  });
});

const onDelete = catchAsync(async (req, res, next) => {
  const pool = await dbClient.getConnection(config.sql);
  const deleteQuestionQuery = `DELETE FROM [${config.sql.database}].[dbo].[${QuestionsTable.TABLE_NAME}] 
            WHERE _ID = ${req.params.id}`;
  const deleteRes = await pool.request().query(deleteQuestionQuery);

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
  getQuestionsWithDifficulity,
  createQuestion,
  onCreate,
  onUpdate,
  onDelete,
};
