const { ErrorDefault } = require('./state');

class ApplicationError extends Error {
  constructor(status = ErrorDefault, message = 'Internal server error') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { ApplicationError };
