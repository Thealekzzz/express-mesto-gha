const { celebrate, Joi } = require('celebrate');

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri().required(),
  }),

});

const likeCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

const unlikeCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

const deleteCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

module.exports = {
  createCardValidation,
  likeCardValidation,
  unlikeCardValidation,
  deleteCardValidation,
};
