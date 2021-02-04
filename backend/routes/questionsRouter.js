const express = require("express");
const questionsController = require("../controllers/questionsController");
const protectRoutesMiddle = require("../middlewares/protectRoutesMiddle");
const Question = require("../models/questionModel");
const AppError = require("../utils/appError");
const router = express.Router();

const checkQuestionBody = (req, res, next) => {
  const errors = [];
  if (!req.body.question) errors.push("Please provide question!");
  if (!req.body.option1) errors.push("Please provide option1!");
  if (!req.body.option2) errors.push("Please provide option2!");
  if (!req.body.option3) errors.push("Please provide option3!");
  if (!req.body.difficulity) errors.push("Please provide difficulity!");
  if (!req.body.correctAnswer) errors.push("Please provide correctAnswer!");
  if (errors.length > 0) throw new Error(errors.join(" "));
  req.body.questionOBJ = new Question(
    req.body.question,
    req.body.option1,
    req.body.option2,
    req.body.option3,
    req.body.difficulity,
    req.body.correctAnswer
  );
  req.body.questionOBJ.setId(req.params.id);
  next();
};

router
  .route("/random")
  .get(
    protectRoutesMiddle.protect,
    questionsController.getQuestionsWithDifficulity
  );

router
  .route("/")
  .get(protectRoutesMiddle.protect, questionsController.getQuestions)
  .post(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    checkQuestionBody,
    questionsController.onCreate
  );

router
  .route("/:id")
  .get(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    questionsController.getQuestion
  )
  .put(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    checkQuestionBody,
    questionsController.onUpdate
  )
  .delete(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    questionsController.onDelete
  );

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
