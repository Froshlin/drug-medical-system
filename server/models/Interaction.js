const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
    drug1: { type: String, required: true, lowercase: true, index: true },
    drug2: { type: String, required: true, lowercase: true, index: true },
    severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        required: true
    },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Interaction', InteractionSchema);