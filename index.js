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

require('dotenv').config();
const corsOptions = {
    exposedHeaders: 'Authorization',
};

app.use(require('cors')(corsOptions));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    console.log(`${req.method.toUpperCase()} ${req.url}`);
    next();
});

app.use('/api/v1/users', require('./routes/users'));
app.use(auth);
app.use('/api/v1/admin', permit(ADMIN), require('./routes/admin'));
app.use('/api/v1/college', permit(DEAN), require('./routes/colleges'));
app.use('/api/v1/department', permit(HEAD), require('./routes/departments'));

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
    console.log(`App is running on port ${port}`)
});

mongoose.connect(
        process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => console.log("App is connected to the database."))
    .catch(console.log);