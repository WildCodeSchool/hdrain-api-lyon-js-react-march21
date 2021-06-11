const mongoose = require('mongoose');
const connection = require('../db');

const SensorSchema = new mongoose.Schema({
  sensorNumber: Number,
  coord: {
    spotName: String,
    lat: Number,
    lng: Number,
  },
  status: Number,
  locationId: { type: mongoose.ObjectId, required: false },
});

const Sensor = connection.model('Sensor', SensorSchema);

module.exports = Sensor;
