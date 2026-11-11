const { AppError } = require('../errors/AppError');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message).join(', ');
      throw new AppError(messages, 400);
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validate };
