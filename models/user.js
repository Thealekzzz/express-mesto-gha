const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный Email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minLength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxLength: [30, 'Максимальная длина поля "name" - 30 символов'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minLength: [2, 'Минимальная длина поля "about" - 2 символа'],
      maxLength: [30, 'Максимальная длина поля "about" - 30 символов'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
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
