const express = require('express');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errors } = require('celebrate');

const error = require('./middlewares/error');
const indexRouter = require('./routes');
const { app, PORT } = require('./config');
const checkCors = require('./middlewares/checkCors');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(checkCors);

app.use('/api/', indexRouter);

app.use(errorLogger);
app.use(errors());
app.use(error);
app.listen(PORT);
