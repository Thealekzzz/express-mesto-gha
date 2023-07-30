const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
require('dotenv').config();

const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const error = require('./middlewares/error');

const { pathNotFound } = require('./consts/errorMessages');
const signRouter = require('./routes/sign');
const NotFoundError = require('./errors/NotFoundError');

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', signRouter);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('/*', (req, res, next) => next(new NotFoundError(pathNotFound)));

app.use(errors());
app.use(error);
app.listen(PORT, (err) => {
  if (err) {
    console.log('Ошибка запуска сервера');
  }

  console.log(`Сервер запущен на порту ${PORT}`);
});
