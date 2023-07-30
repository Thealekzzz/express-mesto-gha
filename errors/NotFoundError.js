const { NOT_FOUND_ERROR } = require('../consts/statuses');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR;
  }
}

module.exports = NotFoundError;
