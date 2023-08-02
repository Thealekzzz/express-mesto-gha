const {
  cardNotFound, deletingOthersCard,
} = require('../consts/errorMessages');
const {
  OK, CREATED,
} = require('../consts/statuses');

const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

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

  const newCard = new Card({ name, link, owner: ownerId });

  newCard.save()
    .then(() => {
      res.status(CREATED).send(newCard);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .then(async (card) => {
      if (!card) {
        throw new NotFoundError(cardNotFound);
      }

      if (!card.owner.equals(userId)) {
        throw new ForbiddenError(deletingOthersCard);
      }

      await card.deleteOne();

      res.status(OK).send(card);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(cardNotFound);
      }

      res.status(OK).send(card);
    })
    .catch(next);
};

const unlikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(cardNotFound);
      }

      res.status(OK).send(card);
    })
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, unlikeCard,
};
