const { celebrate, Joi } = require('celebrate');

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .email()
      .min(2)
      .max(30),
    password: Joi.string().required(),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().uri().optional(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
  }),
});

module.exports = {
  loginValidation,
  createUserValidation,
  getUserByIdValidation,
  updateAvatarValidation,
  updateUserValidation,
};
