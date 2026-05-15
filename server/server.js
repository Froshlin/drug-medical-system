const PORT = process.env.PORT || 5000;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://drug-medical-system.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected Successfully'))
    .catch((err) => console.error(' MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const complaintRoutes = require('./routes/complaintRoutes')

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/complaints', complaintRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.send(`
    <h2>Drug Interaction Checker API</h2>
    <p>Server is running successfully!</p>
    <p><strong>Status:</strong> Active</p>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Ready at: http://localhost:${PORT}/api`);
});