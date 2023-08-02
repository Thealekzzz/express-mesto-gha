const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  unlikeCard,
  likeCard,
} = require('../controllers/card');
const {
  createCardValidation,
  likeCardValidation,
  deleteCardValidation,
  unlikeCardValidation,
} = require('../middlewares/validations/card');
const auth = require('../middlewares/auth');

cardRouter.get('/', auth, getCards);

cardRouter.post('/', auth, createCardValidation, createCard);

cardRouter.put('/:cardId/likes', auth, likeCardValidation, likeCard);

cardRouter.delete('/:cardId', auth, deleteCardValidation, deleteCard);
cardRouter.delete('/:cardId/likes', auth, unlikeCardValidation, unlikeCard);

module.exports = cardRouter;
