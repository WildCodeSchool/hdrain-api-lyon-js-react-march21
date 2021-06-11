const mongoose = require('mongoose');

const connection = require('../db');

const { Schema } = mongoose;

const ExperienceSchema = new Schema({
  timestamp: Date,
  log: String,
  diagnosticGraph: String,
  costGraph: String,
  LocationId: { type: mongoose.ObjectId, required: false },
});

const Experience = connection.model('Experience', ExperienceSchema);

module.exports = Experience;
