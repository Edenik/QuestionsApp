const filterObj = require("../utils/filterObj");

const User = require("../models/userModel");
const Question = require("../models/questionModel");

const checkUserBody = (req, res, next) => {
  const filteredBody = filterObj(req.body, "username", "email", "password");
  const errors = [];
  if (!filteredBody.email) errors.push("Please provide email!");
  if (!filteredBody.username) errors.push("Please provide username!");
  if (!filteredBody.password) errors.push("Please provide password!");
  if (errors.length > 0) throw new Error(errors.join(" "));
  req.userOBJ = new User(
    filteredBody.email,
    filteredBody.username,
    filteredBody.password,
    "user"
  );
  if (req.params.id !== undefined) req.userOBJ.setId(req.params.id);
  next();
};

const checkUserBodyForUpdate = (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "email",
    "username",
    "password",
    "role",
    "highscore",
    "id"
  );
  const errors = [];
  if (!/^[0-5]$/.test(filteredBody.highscore))
    errors.push("Please provide highscore between 0-5!");

  if (!filteredBody.username) errors.push("Please provide username!");
  if (!filteredBody.email) errors.push("Please provide email!");
  if (!filteredBody.password) errors.push("Please provide password!");
  if (!filteredBody.role) errors.push("Please provide role!");
  if (errors.length > 0) throw new Error(errors.join(" "));
  req.userOBJ = new User(
    filteredBody.email,
    filteredBody.username,
    filteredBody.password,
    "user",
    filteredBody.id,
    filteredBody.highscore
  );

  if (req.params.id) req.userOBJ.setId(req.params.id * 1);
  next();
};

const checkQuestionBody = (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "question",
    "option1",
    "option2",
    "option3",
    "difficulity",
    "correctAnswer"
  );
  const errors = [];
  if (!filteredBody.question) errors.push("Please provide question!");
  if (!filteredBody.option1) errors.push("Please provide option1!");
  if (!filteredBody.option2) errors.push("Please provide option2!");
  if (!filteredBody.option3) errors.push("Please provide option3!");
  if (!filteredBody.difficulity) errors.push("Please provide difficulity!");
  if (!filteredBody.correctAnswer) errors.push("Please provide correctAnswer!");
  if (errors.length > 0) throw new Error(errors.join(" "));
  req.questionOBJ = new Question(
    filteredBody.question,
    filteredBody.option1,
    filteredBody.option2,
    filteredBody.option3,
    filteredBody.difficulity,
    filteredBody.correctAnswer,
    req.params.questionID
  );

  if (!req.body.id) req.questionOBJ.setId(req.params.id);
  next();
};

module.exports = { checkUserBody, checkQuestionBody, checkUserBodyForUpdate };
