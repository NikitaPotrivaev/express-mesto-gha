/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const AuthorizationError = require('../utils/AuthorizationError'); // 401

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  let payload;
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, 'token-generate-key');
  } catch (error) {
    return next(new AuthorizationError('Неверные почта или пароль'));
  }
  req.user = payload;
  next();
};
