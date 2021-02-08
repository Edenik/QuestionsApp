const { promisify } = require("util");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jws = require("jsonwebtoken");
const dbClient = require("../utils/dbClient");
const UsersTable = require("../data/users/usersTable");

const config = require("../config");
const User = require("../models/userModel");

const decodeToken = (token, next) =>
  promisify(jws.verify)(token, config.jwtSecret).catch((err) => {
    if (err.message === "invalid token") {
      return next(
        new AppError(
          "You are not logged in! To get access, please log in!",
          401
        )
      );
    } else if (err.message === "jwt expired") {
      return next(
        new AppError("Your token expired, please log in again!", 401)
      );
    }
    return next(new AppError("Token Error, please log in!", 401));
  });

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else
    () => {
      return next(
        new AppError(
          "You are not logged in! To get access, please log in!",
          401
        )
      );
    };

  const decoded = await decodeToken(token, next);
  const pool = await dbClient.getConnection(config.sql);

  const getUserQuery = `SELECT * 
            FROM [${config.sql.database}].[dbo].[${UsersTable.TABLE_NAME}]
            WHERE _ID = ${decoded.id}`;

  let user = await pool
    .request()
    .query(getUserQuery)
    .catch((err) => {
      console.log(err);
      next(new AppError("Error with DB! (No data or connection error)", 500));
    });

  user = user.recordset[0];

  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does not longer exist!",
        401
      )
    );
  }

  const currentUser = new User(
    user.email,
    user.username,
    null,
    user.role,
    user._ID,
    user.passwordChangedAt
  );

  if (currentUser.changedPasswordAfterLogin(decoded.iat)) {
    return next(
      new AppError(
        "The user recently changed password, please log in again!",
        401
      )
    );
  }
  req.user = currentUser;
  req.params.id = currentUser.id;
  next();
});

exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      return next(
        new AppError("You do not have premmission to perform this action", 403)
      );
    }
    next();
  };
};

exports.restrictToMe = (id) => {
  return (req, res, next) => {
    next();
  };
};
