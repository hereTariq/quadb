const express = require('express');
const ErrorHandler = require('./middlewares/errorHandler');
require('dotenv').config();
const sequelize = require('./models/db');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));

// 404 middleware
app.use((req, res, next) => {
    next(new ErrorHandler('Route not found', 404));
});

// error middleware

sequelize
    .authenticate()
    .then(() => {
        console.log('db connected');
        sequelize.sync();
    })
    .catch((err) => console.log('Error in db connection |', err.message));

app.use((err, req, res, next) => {
    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;

    if (err.code == 'ER_DUP_ENTRY') {
        let message = err.errors[0]?.message;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log('server is running on http://localhost:' + PORT)
);
