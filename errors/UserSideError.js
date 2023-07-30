const { USER_SIDE_ERROR } = require('../consts/statuses');

class UserSideError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = USER_SIDE_ERROR;
  }
}

module.exports = UserSideError;
