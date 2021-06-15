//const mongoose = require('mongoose');
const connection = require('../db');

const LocationSchema = new mongoose.Schema({
  name: String,
  coord: { lat: Number, lng: Number },
  sensorList: { type: Array, required: false },
  experienceList: { type: Array, required: false },
});

const Location = connection.model('Location', LocationSchema);

module.exports = Location;
