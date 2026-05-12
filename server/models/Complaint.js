const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: { type: String, required: true },
    complaint: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    doctorResponse: { type: String },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);