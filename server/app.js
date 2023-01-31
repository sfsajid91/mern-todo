require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose'); // mongoose is not used in this project

const middlewares = require('./middlewares/middlewares');
const errors = require('./middlewares/errors');
const routes = require('./routes/routes');

const app = express();

app.use(middlewares);
app.use('/api/v1', routes);
app.use(errors);

const PORT = process.env.PORT || 5000;

// function for database connection
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URI);
        console.log(chalk.green.inverse('Database Connected...'));
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.log(chalk.red(err.message));
    }
};

connectDB();

// app.listen(PORT, () => {
//     console.log(chalk.green.inverse(`Server is running on port ${PORT}`));
// });
