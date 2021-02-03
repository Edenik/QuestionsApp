const AppError = require("../utils/appError");

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.errmsg.match(/"([^"]*)"/)[0];
//   const message = `Duplicate field value:  ${value}, Please use another value`;
//   return new AppError(message, 400);
// };

// const handleValidationErrorDB = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);
//   const message = `Invalid input data. ${errors.join(". ")}`;
//   return new AppError(message, 400);
// };

const handleCastErrorDB = (err) => {
  const message = `Error with DB! (No data or connection error)`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Opertaional, trusted error: send message to client

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("Error ", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // if (process.env.NODE_ENV === "development") {
  //   sendErrorDev(err, res);
  // } else {
  let error = Object.create(err);
  if (/Invalid object name/.test(error.message))
    error = handleCastErrorDB(error);
  sendErrorProd(error, res);
  // }

  sendErrorProd(error, res);
};
