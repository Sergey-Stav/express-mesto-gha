const { ApplicationError } = require('./errors');
const { ErrorUnauthorized } = require('./state');

class UnauthorizedError extends ApplicationError {
  constructor(message) {
    super(ErrorUnauthorized, message);
  }
}

module.exports = UnauthorizedError;
