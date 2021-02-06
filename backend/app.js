const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// Routers
const serverConfigRouter = require("./routes/serverConfigRouter");
const questionsRouter = require("./routes/questionsRouter");
const usersRouter = require("./routes/usersRouter");

const app = express();

// Middlewares
app.use(cors());

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this ip, please try again later!",
  });

  app.use("/api", limiter);
}

app.use(express.json({ limit: "15kb" }));

app.use(xss());

app.use(hpp());

// Routes
app.use("/api/v1/serverConfig", serverConfigRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/users", usersRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
