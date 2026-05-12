const Prescription = require('../models/Prescription');

exports.createPrescription = async (req, res) => {
    try {
        const { patientName, drugs, notes } = req.body;
        const doctorId = req.user.id;

        const prescription = new Prescription({
            doctorId,
            patientName,
            drugs,
            interactionsFound: [],
            notes
        });

        await prescription.save();

        res.status(201).json({
            success: true,
            message: "Prescription saved successfully",
            prescription
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save prescription" });
    }
};

exports.getPrescriptions = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const prescriptions = await Prescription.find({ doctorId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            prescriptions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch prescriptions" });
    }
};