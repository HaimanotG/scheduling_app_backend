const express = require('express');
const mongoose = require('mongoose');

const auth = require('./middlewares/auth');
const permit = require('./middlewares/permit');
const {
    ADMIN,
    HEAD,
    DEAN
} = require('./enums/roles');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use('/api/v1/users', require('./routes/users'));
app.use(auth);
app.use('/api/v1/admin', permit(ADMIN), require('./routes/admin'));
app.use('/api/v1/college', permit(DEAN), require('./routes/colleges'));
app.use('/api/v1/department', permit(HEAD), require('./routes/departments'));

app.use((req, res, next) => {
    const error = new Error("Page Not Found");
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

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
});

mongoose.connect(
        process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => console.log("App is connected to the database."))
    .catch(console.log);