const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: { type: String, required: true },
    drugs: [{ type: String, required: true }],
    interactionsFound: [{
        pair: [String],
        severity: String,
        description: String
    }],
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);