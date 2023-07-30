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

cardRouter.post('/', createCardValidation, auth, createCard);

cardRouter.put('/:cardId/likes', likeCardValidation, auth, likeCard);

cardRouter.delete('/:cardId', deleteCardValidation, auth, deleteCard);
cardRouter.delete('/:cardId/likes', unlikeCardValidation, auth, unlikeCard);

module.exports = cardRouter;
