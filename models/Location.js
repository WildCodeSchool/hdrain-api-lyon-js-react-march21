const mongoose = require('mongoose');

const { Schema } = mongoose;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  assimilationLog: {
    type: String,
    required: true,
  },
  rainMap: {
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
  inferenceLog: {
    type: String,
    required: true,
  },
  sensorStatus: {
    type: String,
    required: true,
  },
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = {
  Location,
};
