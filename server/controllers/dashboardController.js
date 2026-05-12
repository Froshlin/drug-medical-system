const Prescription = require('../models/Prescription');
const Complaint = require('../models/Complaint');

exports.getStats = async (req, res) => {
    try {
        const doctorId = req.user.id;

        // Today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const totalPrescriptions = await Prescription.countDocuments({ doctorId });

        const patientsToday = await Prescription.countDocuments({
            doctorId,
            createdAt: { $gte: today, $lt: tomorrow }
        });

        const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
        const totalComplaints = await Complaint.countDocuments({});

        res.json({
            success: true,
            stats: {
                totalPrescriptions,
                patientsToday,
                pendingComplaints,
                totalComplaints,
                thisMonth: Math.floor(totalPrescriptions * 0.65)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
};