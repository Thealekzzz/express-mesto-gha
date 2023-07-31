const { celebrate, Joi } = require('celebrate');
const { urlPattern } = require('../../consts/regexs');

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlPattern).required(),
  }),

});

const likeCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
});

const unlikeCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
});

const deleteCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
});

module.exports = {
  createCardValidation,
  likeCardValidation,
  unlikeCardValidation,
  deleteCardValidation,
};
