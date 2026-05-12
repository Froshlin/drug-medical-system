const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Create a demo doctor account (for testing)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;