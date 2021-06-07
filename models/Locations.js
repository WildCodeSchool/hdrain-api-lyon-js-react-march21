import mongoose from 'mongoose';

const { Schema } = mongoose;
const ExperienceSchema = require('./Experience');
const SensorsSchema = require('./Sensors');

// const mongoDB = require('../db');

const LocationSchema = new Schema({
  name: String, 
  coord: { longitude: Number, latitude: Number },
  sensors: [
    SensorsSchema,
  ],
  experiences: [
    ExperienceSchema,
  ],
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;

