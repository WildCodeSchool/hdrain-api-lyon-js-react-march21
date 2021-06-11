const mongoose = require('mongoose');

const connection = require('../db');

const { Schema } = mongoose;

// const mongoDB = require('../db');

const SensorSchema = new Schema({
  idNumber: Number,
  coord: { 
    spotName: String, 
    longitude: Number, 
    latitude: Number },
  status: Number,
  locationId: { type: mongoose.ObjectId, required: false },
});


const Sensor = connection.model('Sensor', SensorSchema);

module.exports = Sensor;
