const express = require("express");
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");
const User = require("../models/userModel");
const router = express.Router();
const AppError = require("../utils/appError");

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

router.post("/signup", checkUserBody, authController.onCreate);
router.post("/login", authController.login);

router.route("/").get(usersController.getUsers);

router
  .route("/:id")
  .get(usersController.getUser)
  .put(checkUserBody, usersController.onUpdate)
  .delete(usersController.onDelete);

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
