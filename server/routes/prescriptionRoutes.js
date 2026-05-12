const express = require('express');
const router = express.Router();

const prescriptionController = require('../controllers/prescriptionController');
const dashboardController = require('../controllers/dashboardController');   // ← Add this
const auth = require('../middleware/auth');

// Prescription Routes
router.post('/', auth, prescriptionController.createPrescription);
router.get('/', auth, prescriptionController.getPrescriptions);

// Stats Route
router.get('/stats', auth, dashboardController.getStats);

module.exports = router;