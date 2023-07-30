const {
  invalidCardCredentials, cardNotFound, deletingOthersCard, invalidIdFormat,
} = require('../consts/errorMessages');
const {
  USER_SIDE_ERROR, OK, NOT_FOUND_ERROR, CREATED,
} = require('../consts/statuses');

const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const UserSideError = require('../errors/UserSideError');

const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((data) => {
      res.status(OK).send(data);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  if (!name || !link) {
    res.status(USER_SIDE_ERROR).send({ message: 'Данные карточки не отправлены' });
    return;
  }

  const newCard = new Card({ name, link, owner: ownerId });

  newCard.save()
    .then(() => {
      res.status(CREATED).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new UserSideError(invalidCardCredentials));
      }

      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  if (!cardId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID карточки не передан' });
  }

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(cardNotFound);
      }

      if (!card.owner.equals(userId)) {
        throw new ForbiddenError(deletingOthersCard);
      }

      Card.deleteOne({ _id: cardId })
        .then((data) => {
          res.status(OK).send(data);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new UserSideError(invalidIdFormat));
      }

      next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!cardId) {
    res.status(NOT_FOUND_ERROR).send({ message: 'ID карточки не передан' });
  }

  if (!userId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID пользователя не передан' });
  }

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(cardNotFound);
      }

      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new UserSideError(invalidIdFormat);
      }

      next(err);
    });
};

const unlikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!cardId) {
    res.status(NOT_FOUND_ERROR).send({ message: 'ID карточки не передан' });
  }

  if (!userId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID пользователя не передан' });
  }

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(cardNotFound);
      }

      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new UserSideError(invalidIdFormat));
      }

      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, unlikeCard,
};
