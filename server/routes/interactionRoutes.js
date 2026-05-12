const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const auth = require('../middleware/auth');

router.post('/check', auth, interactionController.checkInteractions);

module.exports = router;