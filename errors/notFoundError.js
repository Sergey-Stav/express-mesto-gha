const { ApplicationError } = require('./errors');
const { ErrorNotFound } = require('./state');

class NotFound extends ApplicationError {
  constructor(message) {
    super(ErrorNotFound, message);
  }
}

module.exports = NotFound;
