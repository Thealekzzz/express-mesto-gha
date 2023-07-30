const { createUser, login } = require('../controllers/user');
const { loginValidation, createUserValidation } = require('../middlewares/validations/user');

const signRouter = require('express').Router();

signRouter.post('/signin', loginValidation, login);
signRouter.post('/signup', createUserValidation, createUser);

module.exports = signRouter;
