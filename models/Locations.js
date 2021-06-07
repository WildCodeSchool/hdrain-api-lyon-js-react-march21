import mongoose from 'mongoose';

const { Schema } = mongoose;

const mongoDB = require('../db');

const LocationSchema = new Schema({
  name: String, 
  coord: { longitude: Number, latitude: Number },
  sensors: [
    {
      idNumber: Number,
      coord: { longitude: Number, latitude: Number },
      status: Number,
    },
  ],
  experiences: [
    {
      timestamp: Date,
      log: String,
      diagnosticGraph: { data: Buffer, contentType: String },
      costGraph: { data: Buffer, contentType: String },
    },
  ],
});

const Location = mongoose.model('Location', LocationSchema);

