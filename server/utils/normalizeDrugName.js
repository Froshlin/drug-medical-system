const normalizationMap = {
    "panadol": "paracetamol",
    "panadol extra": "paracetamol",
    "flagyl": "metronidazole",
    "augmentin": "amoxicillin clavulanate",
    "ampiclox": "ampicillin cloxacillin",
    "emzor paracetamol": "paracetamol",
    "felvin": "piroxicam",
    "ibuprofen": "ibuprofen",
    "diclofenac": "diclofenac",
    // Add more Nigerian brand names here
};

const normalizeDrugName = (name) => {
    if (!name) return '';
    const lower = name.toLowerCase().trim();
    return normalizationMap[lower] || lower;
};

module.exports = { normalizeDrugName };