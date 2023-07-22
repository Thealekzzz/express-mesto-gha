const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" является обязательным'],
      minLength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxLength: [30, 'Максимальная длина поля "name" - 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" является обязательным'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
