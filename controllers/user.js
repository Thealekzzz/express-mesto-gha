const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).send({ message: 'Не отправлен id пользователя' });
    return;
  }

  User.findById(userId)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
        return;
      }

      res.status(404).send({ message: 'Пользователя с таким ID не существует' });
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    res.status(400).send({ message: 'Не отправлены данные пользователя' });
    return;
  }

  const newUser = new User({ name, avatar, about });

  newUser.save()
    .then(() => {
      res.status(200).send(newUser);
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  if (!userId) {
    res.status(400).send({ message: 'Не отправлен ID пользователя' });
    return;
  }

  if (!avatar) {
    res.status(400).send({ message: 'Не передан аватар пользователя' });
    return;
  }

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Пользователя с таким ID не существует' });
        return;
      }

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  if (!userId) {
    res.status(400).send({ message: 'Не отправлен ID пользователя' });
    return;
  }

  if (!name && !about) {
    res.status(400).send({ message: 'Не переданы данные для обновления' });
    return;
  }

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Пользователь с таким ID не найден' });
        return;
      }

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateAvatar, updateUser,
};
