const {
  USER_SIDE_ERROR, SERVER_SIDE_ERROR, OK, NOT_FOUND_ERROR, CREATED,
} = require('../consts/statuses');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((data) => {
      res.status(OK).send(data);
    })
    .catch((err) => {
      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

const createCard = (req, res) => {
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
        res.status(USER_SIDE_ERROR).send({ message: 'Отправленные данные не прошли валидацию' });
        return;
      }

      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!cardId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID карточки не передан' });
  }

  Card.deleteOne({ _id: cardId })
    .then((data) => {
      if (data.deletedCount === 0) {
        throw new Error('InvalidID');
      }

      res.status(OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(USER_SIDE_ERROR).send({ message: 'Неверный формат ID карточки' });
        return;
      }

      if (err.message === 'InvalidID') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }

      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!cardId) {
    res.status(NOT_FOUND_ERROR).send({ message: 'ID карточки не передан' });
  }

  if (!userId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID пользователя не передан' });
  }

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new Error('InvalidID');
      }

      res.status(OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(USER_SIDE_ERROR).send({ message: 'Неверный формат ID пользователя' });
        return;
      }

      if (err.message === 'InvalidID') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }

      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

const unlikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!cardId) {
    res.status(NOT_FOUND_ERROR).send({ message: 'ID карточки не передан' });
  }

  if (!userId) {
    res.status(USER_SIDE_ERROR).send({ message: 'ID пользователя не передан' });
  }

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new Error('InvalidID');
      }

      res.status(OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(USER_SIDE_ERROR).send({ message: 'Неверный формат ID пользователя' });
        return;
      }

      if (err.message === 'InvalidID') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }

      res.status(SERVER_SIDE_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, unlikeCard,
};
