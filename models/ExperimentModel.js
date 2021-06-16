const connection = require('../db');

const ExperimentSchema = new mongoose.Schema({
  timestamp: Date,
  log: String,
  diagnosticGraph: String,
  costGraph: String,
  parameter: String,
  locationId: { type: mongoose.ObjectId, required: false },
});

const Experiment = connection.model('Experiment', ExperimentSchema);

module.exports = Experiment;
