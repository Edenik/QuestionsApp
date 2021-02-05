const config = require("../../config");
const UsersTable = require("../../data/users/usersTable");
const usersQueries = require("../../data/users/usersQueries");
const User = require("../../models/userModel");
const catchAsync = require("../../utils/catchAsync");
const dbClient = require("../../utils/dbClient");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const filterObj = require("../../utils/filterObj");

const getCurrentUser = async ({ id, getPassword, next }) => {
  try {
    const pool = await dbClient.getConnection(config.sql);

    const currentUser = await pool
      .request()
      .query(usersQueries.getUserDetailsWithOrWithoutPassword(getPassword, id))
      .catch(() => {
        next(new AppError("Error with DB! (No data or connection error)"));
      });

    return currentUser.recordsets[0][0];
  } catch (err) {
    return next(new AppError("Error with DB! (No data or connection error)"));
  }
};

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.newPassword) {
    return next(new AppError("This route is not for password updates!", 400));
  }

  if (!req.body.username || !req.body.email) {
    return next(
      new AppError("To update user you must include email and username!", 400)
    );
  }
  const filteredBody = filterObj(req.body, "username", "email");

  const currentUser = new User(
    filteredBody.email,
    filteredBody.username,
    req.user.password,
    req.user.role,
    req.user.highscore,
    req.user.id
  );

  const pool = await dbClient.getConnection(config.sql);
  await pool
    .request()
    .query(usersQueries.updateUserEmailAndNameQuery(currentUser));

  res.status(201).json({
    status: "success",
    data: {
      user: currentUser,
    },
  });
});

const getMe = catchAsync(async (req, res, next) => {
  const user = await getCurrentUser({
    getPassword: false,
    id: req.user.id,
    next,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const onDeActivateMe = catchAsync(async (req, res, next) => {
  const currentUser = await getCurrentUser({
    getPassword: false,
    id: req.user.id,
    next,
  });

  if (currentUser.active == 0) {
    return next(new AppError("User deleted already", 400));
  }
  await activate({ id: req.user.id, activate: 0, next });

  const message = `
  <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">GoodBye 😢</h1>
  <p>  <strong>We hope to see you back soon!</strong></p>
 `;

  await sendEmail({
    email: currentUser.email,
    subject: "It's hurt to say goodbye 😢 - QuizApp",
    message,
  }).catch((err) => console.log(err));

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const activate = async ({ id, activate, next }) => {
  try {
    const pool = await dbClient.getConnection(config.sql);

    return await pool
      .request()
      .query(usersQueries.activateUserQuery(activate, id));
  } catch (err) {
    return next(new AppError("Error updating activate / delete user", 400));
  }
};

const onActivateMe = catchAsync(async (req, res, next) => {
  if (!req.body.password) {
    return next(
      new AppError("To activate user you must include password!", 400)
    );
  }

  const currentUser = await getCurrentUser({
    getPassword: true,
    id: req.user.id,
    next,
  });

  if (currentUser.active == 1) {
    return next(new AppError("User activated already", 400));
  }

  const userOBJ = new User(
    currentUser.email,
    currentUser.username,
    currentUser.password,
    currentUser.role,
    currentUser._ID
  );

  if (
    !(await userOBJ.checkPassword(req.body.password, userOBJ.getPassword()))
  ) {
    next(
      new AppError("You are not allowed to activate the user right now!", 401)
    );
  }

  currentUser.active = 1;

  await activate({ id: req.user.id, activate: 1, next });

  const message = `
  <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Welcome Back 😃⭐</h1>
  <p>  <strong>It's good to see you here again!</strong></p>
 `;

  await sendEmail({
    email: currentUser.email,
    subject: "Welcome Back 😃⭐ - QuizApp",
    message,
  }).catch((err) => console.log(err));

  res.status(200).json({
    status: "success",
    data: currentUser,
  });
});

module.exports = {
  getMe,
  updateMe,
  onActivateMe,
  onDeActivateMe,
};
