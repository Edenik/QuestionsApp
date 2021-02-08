const express = require("express");
const usersController = require("../controllers/usersControllers/usersController");
const usersAdminController = require("../controllers/usersControllers/usersAdminController");
const authController = require("../controllers/usersControllers/authController");
const router = express.Router();
const AppError = require("../utils/appError");
const protectRoutesMiddle = require("../middlewares/protectRoutesMiddle");
const {
  checkUserBody,
  checkUserBodyForUpdate,
} = require("../middlewares/checkReqBodyMiddle");

router
  .route("/me")
  .get(protectRoutesMiddle.protect, usersController.getMe)
  .patch(protectRoutesMiddle.protect, usersController.updateMe);

router
  .route("/me/updateHighscore")
  .patch(protectRoutesMiddle.protect, usersController.updateHighscore);

router
  .route("/me/updatePassword")
  .patch(protectRoutesMiddle.protect, authController.updatePassword);

router
  .route("/me/activate")
  .patch(protectRoutesMiddle.protect, usersController.onActivateMe);

router
  .route("/me/delete")
  .delete(protectRoutesMiddle.protect, usersController.onDeActivateMe);

router.post("/signup", checkUserBody, authController.onCreate);

router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword);

router
  .route("/")
  .get(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    usersAdminController.getUsers
  );

router
  .route("/stats")
  .get(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    usersAdminController.getStats
  );

router
  .route("/:id")
  .get(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    usersAdminController.getUser
  )
  .patch(
    // protectRoutesMiddle.protect,
    // protectRoutesMiddle.restrictTo("admin"),
    checkUserBodyForUpdate,
    usersAdminController.onUpdate
  )
  .delete(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    usersAdminController.onDelete
  );

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
