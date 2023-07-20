const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, unlikeCard, likeCard,
} = require('../controllers/card');

cardRouter.get('/', getCards);

cardRouter.post('/', createCard);

cardRouter.put('/:cardId/likes', likeCard);

cardRouter.delete('/:cardId', deleteCard);
cardRouter.delete('/:cardId/likes', unlikeCard);

module.exports = cardRouter;
