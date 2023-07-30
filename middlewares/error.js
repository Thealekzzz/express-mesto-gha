const error = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Серверная ошибка'
      : message,
  });

  next();
};

module.exports = error;
