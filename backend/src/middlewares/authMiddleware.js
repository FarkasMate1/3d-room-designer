const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { AppError } = require('../errors/AppError');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401);
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    next();
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}

module.exports = { authMiddleware };
