const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR } = require('../consts/statuses');

function auth(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.PRIVATE_KEY);
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
}

module.exports = auth;
