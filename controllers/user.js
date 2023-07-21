const User = require('../models/user');
const {
  USER_SIDE_ERROR, NOT_FOUND_ERROR, SERVER_SIDE_ERROR, OK,
} = require('../consts/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID пользователя не отправлен' });
    return;
  }

  User.findById(userId)
    .then((data) => {
      if (!data) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }

      res.status(OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(USER_SIDE_ERROR).send({ message: 'Неверный формат ID пользователя' });
        return;
      }

      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    res.status(USER_SIDE_ERROR).send({ message: 'Данные пользователя не отправлены' });
    return;
  }

  const newUser = new User({ name, avatar, about });

  newUser.save()
    .then(() => {
      res.status(OK).send(newUser);
    })
    .catch((err) => {
      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  if (!userId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID пользователя не отправлен' });
    return;
  }

  if (!avatar) {
    res.status(USER_SIDE_ERROR).send({ message: 'Аватар пользователя не отправлен' });
    return;
  }

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }

      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(USER_SIDE_ERROR).send({ message: 'Неверный формат ID пользователя' });
        return;
      }

      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  if (!userId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID пользователя не отправлен' });
    return;
  }

  if (!name && !about) {
    res.status(USER_SIDE_ERROR).send({ message: 'Данные для обновления не переданы' });
    return;
  }

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }

      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(USER_SIDE_ERROR).send({ message: 'Неверный формат ID пользователя' });
        return;
      }

      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateAvatar, updateUser,
};
