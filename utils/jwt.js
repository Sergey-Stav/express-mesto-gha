const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const SECRET_KEY_DEV = 'some-secret-key';
const getJwtToken = (id) => jwt.sign({ _id: id }, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY_DEV, { expiresIn: '7d' });
const getPayload = (token) => jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY_DEV);

module.exports = { getJwtToken, getPayload };
