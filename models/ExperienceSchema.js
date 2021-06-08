const mongoose = require('mongoose');

const { Schema } = mongoose;

const ExperienceSchema = new Schema({
  timestamp: Date,
  log: String,
  // diagnosticGraph: { data: Buffer, contentType: String },
  // costGraph: { data: Buffer, contentType: String },
});



module.exports = {ExperienceSchema};
