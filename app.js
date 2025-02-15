const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const ErrorMiddleware = require("./middlewares/Error");
const { envVariables } = require("./config/Constants");
const { default: mongoose } = require("mongoose");
const { makeRequiredDirectories } = require("./utils/RemoveImage");
const ErrorHandler = require("./utils/ErrorHandler");
const app = express();
const { appPort, mongoDbURI } = envVariables;

makeRequiredDirectories();

mongoose
  .connect(mongoDbURI)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const allowedUrls = ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedUrls, // for development only
    credentials: true, // enables setting cookies in the response
  })
);

app.use(express.json());
app.use("/api/v1", routes);

app.use((req, res, next) => {
  next(new ErrorHandler("Route not found", 404));
});

app.use(ErrorMiddleware);
app.listen(appPort, async () => {
  console.log(`Listening to port ${appPort}`);
});
