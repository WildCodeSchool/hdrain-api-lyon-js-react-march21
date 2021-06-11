const mongoose = require('mongoose');

const { Schema } = mongoose;

const connection = require('../db');

const LocationSchema = new Schema({
  name: String,
  coord: { longitude: Number, latitude: Number },
  sensorsList: { type: Array, required: false },
  experiencesList: { type: Array, required: false },
});

const Location = connection.model('Location', LocationSchema);

module.exports = Location;
