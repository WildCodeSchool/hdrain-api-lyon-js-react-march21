import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExperienceSchema = new Schema({
  timestamp: Date,
  log: String,
  diagnosticGraph: { data: Buffer, contentType: String },
  costGraph: { data: Buffer, contentType: String },
});

const Experience = mongoose.model('Experience', ExperienceSchema);

module.exports = {ExperienceSchema, Experience};
