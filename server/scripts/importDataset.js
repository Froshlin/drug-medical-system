const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Interaction = require('../models/Interaction');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas for import...'))
    .catch(err => console.error(err));

const results = [];

fs.createReadStream('../dataset/drug_interactions.csv')  // Make sure file is in dataset folder
    .pipe(csv())
    .on('data', (data) => {
        results.push({
            drug1: (data.drug1 || data['Drug 1'] || '').toLowerCase(),
            drug2: (data.drug2 || data['Drug 2'] || '').toLowerCase(),
            severity: (data.severity || 'moderate').toLowerCase(),
            description: data.description || data['Interaction Description'] || 'Potential harmful interaction.'
        });
    })
    .on('end', async () => {
        try {
            await Interaction.deleteMany({}); // Clear old data
            await Interaction.insertMany(results);
            console.log(`✅ Successfully imported ${results.length} drug interactions!`);
        } catch (err) {
            console.error('Import Error:', err);
        }
        process.exit();
    });