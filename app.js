const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { NOT_FOUND_ERROR } = require('./consts/errors');

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64b6dbf605576c2bb4738780',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Указанный путь не найден' });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log('Ошибка запуска сервера');
  }

  console.log(`Сервер запущен на порту ${PORT}`);
});
