const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');

// Patient Routes
router.get('/my', auth, complaintController.getMyComplaints);
router.post('/', auth, complaintController.submitComplaint);

// Doctor Routes
router.get('/', auth, complaintController.getAllComplaints);
router.put('/:id/respond', auth, complaintController.respondToComplaint);

module.exports = router;