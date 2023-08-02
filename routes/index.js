const cardRouter = require('./card');
const signRouter = require('./sign');
const userRouter = require('./user');

const { pathNotFound } = require('../consts/errorMessages');
const NotFoundError = require('../errors/NotFoundError');

const indexRouter = require('express').Router();

indexRouter.use('/', signRouter);
indexRouter.use('/users', userRouter);
indexRouter.use('/cards', cardRouter);

indexRouter.all('/*', (req, res, next) => next(new NotFoundError(pathNotFound)));

module.exports = indexRouter;
