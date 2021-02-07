const express = require("express");
const questionsController = require("../controllers/questionsControllers/questionsController");
const questionsAdminController = require("../controllers/questionsControllers/questionsAdminController");
const protectRoutesMiddle = require("../middlewares/protectRoutesMiddle");
const AppError = require("../utils/appError");
const router = express.Router();
const { checkQuestionBody } = require("../middlewares/checkReqBodyMiddle");

router.route("/random").get(
  // protectRoutesMiddle.protect,
  questionsController.getQuestionsWithDifficulity
);

router
  .route("/check")
  .get(protectRoutesMiddle.protect, questionsController.checkAnswer);

router
  .route("/")
  .get(
    protectRoutesMiddle.protect,
    // protectRoutesMiddle.restrictTo("admin"),
    questionsAdminController.getQuestions
  )
  .post(
    protectRoutesMiddle.protect,
    // protectRoutesMiddle.restrictTo("admin"),
    checkQuestionBody,
    questionsAdminController.onCreate
  );

router
  .route("/:id")
  .get(
    protectRoutesMiddle.protect,
    // protectRoutesMiddle.restrictTo("admin"),
    questionsAdminController.getQuestion
  )
  .put(
    protectRoutesMiddle.protect,
    // protectRoutesMiddle.restrictTo("admin"),
    checkQuestionBody,
    questionsAdminController.onUpdate
  )
  .delete(
    protectRoutesMiddle.protect,
    // protectRoutesMiddle.restrictTo("admin"),
    questionsAdminController.onDelete
  );

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
