const mongoose = require('mongoose');

const { Schema } = mongoose;
const ExperienceSchema = require('./ExperienceSchema');
const SensorsSchema = require('./SensorsSchema');

const connection = require('../db');

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

const Location = connection.model('Location', LocationSchema);

module.exports = Location;

