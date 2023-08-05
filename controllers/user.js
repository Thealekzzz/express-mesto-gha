const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  OK,
  CREATED,
} = require('../consts/statuses');
const {
  emailIsAlreadyUsed,
  userNotFound,
  invalidUserSigninCredentials,
} = require('../consts/errorMessages');

const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      }

      res.status(OK).send(user);
    })
    .catch(next);
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  const hash = await bcrypt.hash(password, 6);

  const newUser = new User({
    name, avatar, about, email, password: hash,
  });

  newUser.save()
    .then((user) => {
      const { password: _, ...userWithoutPassword } = user._doc;
      res.status(CREATED).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(emailIsAlreadyUsed));
        return;
      }

      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      }

      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError(userNotFound);
      }

      res.send(data);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

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

        const token = jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY || '4a952aade591adfb64a57f228cb6c039', {
          expiresIn: '7d',
        });

        res.cookie('token', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        });

        res.status(OK).send({});
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
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, updateAvatar, updateUser, login, getMe,
};
