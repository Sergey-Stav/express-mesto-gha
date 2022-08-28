const { ApplicationError } = require('./errors');
const { ErrorConflict } = require('./state');

class ConflictError extends ApplicationError {
  constructor(message) {
    super(ErrorConflict, message);
  }
}

module.exports = ConflictError;
