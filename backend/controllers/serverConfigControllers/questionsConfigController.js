const config = require("../../config");
const QuestionsTable = require("../../data/questions/questionsTable");
const {
  createTableQuery,
  removeTableQuery,
} = require("../../data/questions/questionsQueries");
const questionsController = require("../questionsControllers/questionsAdminController");
const questionsData = require("../../data/questions/questionsData");
const dbClient = require("../../utils/dbClient");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

const addQuestionsToDb = async () => {
  try {
    const responses = [];
    for (const question of questionsData.questionsData) {
      await questionsController.createQuestion(question);
      responses.push(question);
    }
    return responses;
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const onCreate = catchAsync(async (req, res, next) => {
  const questions = await createQuestionsTableWithData();
  res.json({
    status: "success",
    data: {
      database: config.sql.database,
      table: QuestionsTable.TABLE_NAME,
      questions: questions.length,
    },
  });
});

const createQuestionsTableWithData = async () => {
  try {
    const pool = await dbClient.getConnection(config.sql);
    await pool
      .request()
      .query(createTableQuery)
      .catch(() => {
        throw new AppError(
          `Table ${QuestionsTable.TABLE_NAME} already created!`,
          400
        );
      });

    const questions = await addQuestionsToDb();

    return questions;
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const onUpgrade = async (req, res, next) => {
  try {
    await deleteQusetionsTable({ force: true });

    const questions = await createQuestionsTableWithData();
    res.json({
      status: "success",
      data: {
        database: config.sql.database,
        table: QuestionsTable.TABLE_NAME,
        questions: questions.length,
      },
    });
  } catch (err) {
    throw new AppError(err, 400);
  }
};

const onDelete = catchAsync(async (req, res, next) => {
  await deleteQusetionsTable({ force: false });
  res.json({
    status: "success",
    data: { message: `Table ${QuestionsTable.TABLE_NAME} Deleted` },
  });
});

const deleteQusetionsTable = async ({ force }) => {
  try {
    const pool = await dbClient.getConnection(config.sql);
    return await pool.request().query(removeTableQuery(force));
  } catch (err) {
    throw new AppError("Error with DB! (No data or connection error)", 400);
  }
};

module.exports = { onCreate, onDelete, onUpgrade };
