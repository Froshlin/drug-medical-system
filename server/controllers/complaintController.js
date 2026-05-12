const Complaint = require('../models/Complaint');

// Submit New Complaint (Patient)
exports.submitComplaint = async (req, res) => {
    try {
        const { complaint } = req.body;
        const patientId = req.user.id;
        const patientName = req.user.name || "Unknown Patient";

        if (!complaint || complaint.trim() === '') {
            return res.status(400).json({ error: "Complaint description is required" });
        }

        const newComplaint = new Complaint({
            patientId,
            patientName,
            complaint: complaint.trim(),
            status: 'pending'
        });

        await newComplaint.save();

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint: newComplaint
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to submit complaint" });
    }
};

// Get Patient's Own Complaints
exports.getMyComplaints = async (req, res) => {
    try {
        const patientId = req.user.id;

        const complaints = await Complaint.find({ patientId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            complaints
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch your complaints" });
    }
};

// Get All Complaints (For Doctors)
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            complaints
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch complaints" });
    }
};

// Respond to Complaint (Doctor)
exports.respondToComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;
        const doctorId = req.user.id;

        const complaint = await Complaint.findByIdAndUpdate(
            id,
            {
                doctorResponse: response,
                status: 'reviewed',
                doctorId
            },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        res.json({
            success: true,
            message: "Response sent successfully",
            complaint
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to respond to complaint" });
    }
};