const { ApplicationError } = require('./errors');
const { ErrorValidation } = require('./state');

class BadRequestError extends ApplicationError {
  constructor(message) {
    super(ErrorValidation, message);
  }
}

module.exports = BadRequestError;
