const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorName: { type: String, required: true },
    patientName: { type: String, required: true },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false   // Optional for now
    },
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