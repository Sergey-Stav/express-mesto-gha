const { getPayload } = require('../utils/jwt');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Требуется авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = getPayload(token);
  } catch (err) {
    next(new UnauthorizedError('Требуется авторизация'));
    return;
  }

  req.user = payload;

  next();
};
