const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  USER_SIDE_ERROR,
  OK,
  CREATED,
  UNAUTHORIZED_ERROR,
} = require('../consts/statuses');
const {
  emailIsAlreadyUsed,
  userNotFound,
  invalidIdFormat,
  invalidUserSignupCredentials,
  invalidUserSigninCredentials,
  invalidAvatar,
} = require('../consts/errorMessages');

const UserSideError = require('../errors/UserSideError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then(res.send)
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID пользователя не отправлен' });
    return;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      }

      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new UserSideError(invalidIdFormat));
      }

      next(err);
    });
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    res.status(USER_SIDE_ERROR).send({ message: 'Данные пользователя не отправлены' });
    return;
  }

  const hash = await bcrypt.hash(password, 6);

  const newUser = new User({
    name, avatar, about, email, password: hash,
  });

  newUser.save()
    .then(() => {
      res.status(CREATED).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserSideError(invalidUserSignupCredentials));
      }

      if (err.code === 11000) {
        next(new ConflictError(emailIsAlreadyUsed));
      }

      next(err);
    });
};

const updateAvatar = (req, res, next) => {
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

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserSideError(invalidAvatar));
      }

      if (err.name === 'CastError') {
        next(new UserSideError(invalidIdFormat));
      }

      next(err);
    });
};

const updateUser = (req, res, next) => {
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

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError(userNotFound);
      }

      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new UserSideError(invalidIdFormat));
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(UNAUTHORIZED_ERROR).send({ message: 'Данные для входа в аккаунт не переданы' });
    return;
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(invalidUserSigninCredentials);
      }

      bcrypt.compare(password, user.password, (err, matched) => {
        if (err) {
          next(err);
          return;
        }

        if (!matched) {
          throw new UnauthorizedError(invalidUserSigninCredentials);
        }

        const token = jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY, {
          expiresIn: '7d',
        });

        res.cookie('token', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        });

        res.status(OK).send('✌');
      });
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      }

      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new UserSideError(invalidIdFormat));
      }

      next(err);
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateAvatar, updateUser, login, getMe,
};
