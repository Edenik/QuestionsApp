const express = require("express");
const usersController = require("../controllers/usersControllers/usersController");
const usersAdminController = require("../controllers/usersControllers/usersAdminController");
const authController = require("../controllers/usersControllers/authController");
const User = require("../models/userModel");
const router = express.Router();
const AppError = require("../utils/appError");
const protectRoutesMiddle = require("../middlewares/protectRoutesMiddle");

const checkUserBody = (req, res, next) => {
  const errors = [];
  if (!req.body.email) errors.push("Please provide email!");
  if (!req.body.username) errors.push("Please provide username!");
  if (!req.body.password) errors.push("Please provide password!");
  if (errors.length > 0) throw new Error(errors.join(" "));
  req.body.userOBJ = new User(
    req.body.email,
    req.body.username,
    req.body.password,
    req.body.role
  );
  req.body.userOBJ.setId(req.params.id);
  next();
};
router
  .route("/me")
  .get(protectRoutesMiddle.protect, usersController.getMe)
  .patch(protectRoutesMiddle.protect, usersController.updateMe);

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
  .route("/:id")
  .get(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    usersAdminController.getUser
  )
  .patch(
    protectRoutesMiddle.protect,
    protectRoutesMiddle.restrictTo("admin"),
    checkUserBody,
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
