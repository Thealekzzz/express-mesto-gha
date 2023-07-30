const signRouter = require('express').Router();

const { createUser, login } = require('../controllers/user');
const { loginValidation, createUserValidation } = require('../middlewares/validations/user');

signRouter.post('/signin', loginValidation, login);
signRouter.post('/signup', createUserValidation, createUser);

module.exports = signRouter;
