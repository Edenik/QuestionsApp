const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// Routers
const serverConfigRouter = require("./routes/serverConfigRouter");
const questionsRouter = require("./routes/questionsRouter");
const usersRouter = require("./routes/usersRouter");

const app = express();

// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  const limiter = rateLimit({
    max: 400,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this ip, please try again later!",
  });

  app.use("/api", limiter);
}

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/serverConfig", serverConfigRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/users", usersRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
