const path = require("path");

const cors = require("cors");
// const compresstion = require("compression");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

const global = require("./middlewares/middlewaresError");
const ApiError = require("./utils/apiError");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const courseRoute = require("./routes/courseRoute");
const materialRoute = require("./routes/materialRoute");
const typeRoute = require("./routes/typeRoute");
const questionRoute = require('./routes/questionRoute');
const scheduleRoute = require("./routes/scheduleRoute");
const gradeRoute = require("./routes/gradeRoute");

dotenv.config({ path: "config.env" });
mongoose.connect(process.env.DB_URI).then((con) => {
  console.log(con.connection.host);
});

const app = express();
// ...
const PORT = process.env.PORT;

app.use(cors());
app.options("*",cors());
// app.use(compresstion());

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// mongoose.set("strictQuery", false);

// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode: development");
}

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/materials", materialRoute);
app.use("/api/v1/types", typeRoute);
app.use("/api/v1/questions", questionRoute);
app.use("/api/v1/schedules", scheduleRoute);
app.use("/api/v1/grades", gradeRoute);



app.all("*", (req, res, next) => {
  next(new ApiError(`This url is not exist: ${req.url}`, 400));
});

app.use(global);

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`unhandled rejection: ${err.name}, ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
