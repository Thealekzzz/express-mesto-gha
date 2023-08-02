const express = require('express');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const error = require('./middlewares/error');
const indexRouter = require('./routes');
const { app, PORT } = require('./config');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.use(errors());
app.use(error);
app.listen(PORT);
