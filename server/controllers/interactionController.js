const Interaction = require('../models/Interaction');
const { normalizeDrugName } = require('../utils/normalizeDrugName');

exports.checkInteractions = async (req, res) => {
    try {
        const { drugs } = req.body;

        if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
            return res.status(400).json({ error: "Please select at least 2 drugs" });
        }

        const normalizedDrugs = drugs.map(d => normalizeDrugName(d));
        const interactions = [];

        for (let i = 0; i < normalizedDrugs.length; i++) {
            for (let j = i + 1; j < normalizedDrugs.length; j++) {
                const d1 = normalizedDrugs[i];
                const d2 = normalizedDrugs[j];

                const found = await Interaction.findOne({
                    $or: [
                        { drug1: d1, drug2: d2 },
                        { drug1: d2, drug2: d1 }
                    ]
                });

                if (found) {
                    interactions.push({
                        pair: [drugs[i], drugs[j]],
                        severity: found.severity,
                        description: found.description
                    });
                }
            }
        }

        res.json({
            success: true,
            interactions,
            totalDrugs: drugs.length,
            totalInteractions: interactions.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while checking interactions" });
    }
};