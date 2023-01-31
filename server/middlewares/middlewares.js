const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Custom headers
const headers = (req, res, next) => {
    res.header('X-Powered-By', process.env.APP_NAME || 'NodeJS'); // X-Powered-By: NodeJS
    next();
};

const middlewares = [express.json(), morgan('dev'), cors(), headers, cookieParser()];

module.exports = middlewares;
