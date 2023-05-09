/* eslint-disable global-require */
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
require('express-async-errors');
const config = require('./utils/config');

const app = express('app');
const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const {
    userExtractor, tokenExtractor, unknownEndpoint, errorHandler,
} = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message);
    });

app.use(tokenExtractor);
app.use(cors());
app.use(express.json());
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', userExtractor, blogsRouter);

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing');
    app.use('/api/testing', testingRouter);
}

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
