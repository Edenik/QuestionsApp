const app = require("./app");
const config = require("./config");
const dbClient = require("./utils/dbClient");

process.on("uncaughtException", (err) => {
  console.log("✖ UnCaught Exeception! Shutting down... ✖");
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port} 🔥`)
);

dbClient
  .getConnection(config.sql)
  .then(() => {
    console.log("DB Connection successful 🚀");
  })
  .catch((err) => console.log(`Error: DB Connection unsuccessful, ${err} `));

process.on("unhandledRejection", (err) => {
  console.log("✖ UnHandled Rejection! Shutting down ✖");
  console.log(err.name, err.message);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
