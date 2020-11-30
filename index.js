const express = require("express");
const mongoose = require("mongoose");
const auth = require("./middlewares/auth");
const permit = require("./middlewares/permit");
const { departments, teachers, batches, courses, rooms } = require("./routes");

const { ADMIN, HEAD, SU } = require("./enums/roles");

const app = express();

require("dotenv").config();
const corsOptions = {
  exposedHeaders: "Authorization"
};

app.use(require("cors")(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use((req, res, next) => {
  console.log(`${req.method.toUpperCase()} ${req.url}`);
  next();
});

app.use("/api/v1/users", require("./routes/users"));
app.use(auth);
app.use("/api/v1/admin/departments", departments);
app.use("/api/v1/admin/teachers", permit([SU, ADMIN, HEAD]), teachers);
app.use("/api/v1/admin/rooms", permit([SU, ADMIN, HEAD]), rooms);
app.use("/api/v1/admin/batches", permit([SU, ADMIN, HEAD]), batches);
app.use("/api/v1/admin/courses", permit([SU, ADMIN, HEAD]), courses);

app.use((req, res, next) => {
  const error = new Error("Resource Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    success: false,
    status: error.status,
    error: {
      message: error.message
    }
  });
});

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("App is connected to the database."))
  .catch(console.log);
