const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" является обязательным'],
      minLength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxLength: [30, 'Максимальная длина поля "name" - 30 символов'],
    },
    about: {
      type: String,
      required: [true, 'Поле "about" является обязательным'],
      minLength: [2, 'Минимальная длина поля "about" - 2 символа'],
      maxLength: [30, 'Максимальная длина поля "about" - 30 символов'],
    },
    avatar: {
      type: String,
      required: [true, 'Поле "avatar" является обязательным'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
