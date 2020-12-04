const express = require("express");
const mongoose = require("mongoose");
const auth = require("./middlewares/auth");
const permit = require("./middlewares/permit");
const error = require("./error");
const Department = require("./models/Department");

const {
    departments,
    teachers,
    batches,
    courses,
    rooms,
    requests
} = require("./routes");

const { ADMIN, HEAD } = require("./enums/roles");

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
app.use("/api/v1/admin/departments", permit(ADMIN), departments);
app.use(permit(HEAD));
app.use("/api/v1/department/teachers", teachers);
app.use("/api/v1/department/rooms", rooms);
app.use("/api/v1/department/batches", batches);
app.use("/api/v1/department/courses", courses);
app.use("/api/v1/department/requests", requests);

app.use("/api/v1/department/head", async (req, res, next) => {
    Department.findOne({
        head: req.user._id
    })
    .populate({
        path: 'teachers',
        select: '_id name'
    })
    .populate({
        path: 'batches',
        populate: {
            path: 'semesters',
            populate: {
                path: 'courses',
            }
        }
    })
    .populate({
        path: 'rooms'
    })
    .exec()
    .then((department, error) => {
        if (error) throw error;
        res.status(200).json(department);
    })
    .catch(e => {
        return next(error(e.message))
    });
});

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("App is connected to the database."))
    .catch(console.log);
