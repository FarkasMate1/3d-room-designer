const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userRepo } = require('../repos/userRepo');
const { AppError } = require('../errors/AppError');
const { env } = require('../config/env');

const authService = {
  async register(email, password, name) {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userRepo.create(email, hashedPassword, name);

    const token = generateToken({ userId, email });

    return {
      user: { id: userId, email, name },
      token,
    };
  },

  async login(email, password) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  },

  async getMe(userId) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return { id: user.id, email: user.email, name: user.name };
  },
};

function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

module.exports = { authService };
