const express = require("express");
const router = express.Router();
const questionsConfigController = require("../controllers/serverConfigControllers/questionsConfigController");
const usersConfigController = require("../controllers/serverConfigControllers/usersConfigController");
const AppError = require("../utils/appError");

router.route("/create/users").post(usersConfigController.onCreate);
router.route("/upgrade/users").post(usersConfigController.onUpgrade);
router.route("/delete/users").delete(usersConfigController.onDelete);

router.route("/create/questions").post(questionsConfigController.onCreate);
router.route("/upgrade/questions").post(questionsConfigController.onUpgrade);
router.route("/delete/questions").delete(questionsConfigController.onDelete);

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
