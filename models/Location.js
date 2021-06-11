const mongoose = require('mongoose');
// const Joi = require('joi');

const { Schema } = mongoose;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  coord: {
    type: Object,
    required: true,
  },

});

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location