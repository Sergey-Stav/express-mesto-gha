const { ApplicationError } = require('./errors');
const { ErrorForbidden } = require('./state');

class ForbiddenError extends ApplicationError {
  constructor(message) {
    super(ErrorForbidden, message);
  }
}

module.exports = ForbiddenError;
