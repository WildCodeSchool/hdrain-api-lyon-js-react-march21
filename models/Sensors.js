import mongoose from 'mongoose';

const { Schema } = mongoose;

// const mongoDB = require('../db');

const SensorsSchema = new Schema({
  idNumber: Number,
  coord: { spotName: String, longitude: Number, latitude: Number },
  status: Number,
});

const Sensors = mongoose.model('Sensors', SensorsSchema);

module.exports = {Sensors, SensorsSchema};
