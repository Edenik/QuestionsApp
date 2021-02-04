const AppError = require("../utils/appError");

const handleJWTError = (err) =>
  new AppError("Invalid token. Please log in again!", 401);

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
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
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

  let error = Object.create(err);
  if (/Invalid object name/.test(error.message))
    error = handleCastErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError(error);

  sendErrorProd(error, res);
};
