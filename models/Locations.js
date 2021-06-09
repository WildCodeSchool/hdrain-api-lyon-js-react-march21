const mongoose = require('mongoose');

const { Schema } = mongoose;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  assimilationlog: {
    type: String,
    required: true,
  },
  rainmap: {
    type: String,
    required: true,
  },
  config: {
    type: String,
    required: true,
  },
  diags: {
    type: String,
    required: true,
  },
  inferencelog: {
    type: String,
    required: true,
  },
  sensorstatus: {
    type: String,
    required: true,
  },
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = {
  Location,
};
