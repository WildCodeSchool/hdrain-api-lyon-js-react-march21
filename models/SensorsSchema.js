const mongoose = require('mongoose');

const { Schema } = mongoose;

// const mongoDB = require('../db');

const SensorsSchema = new Schema({
  idNumber: Number,
  coord: { spotName: String, longitude: Number, latitude: Number },
  status: Number,
});


module.exports = { SensorsSchema};
