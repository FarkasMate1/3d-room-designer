const express = require('express');
const { authController } = require('../controllers/authController');
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
