const sensorsRouter = require('express').Router();
const SensorModel = require('../models/SensorModel');
//deletedAt to be handled (not null) ?
sensorsRouter.post('/', async (req, res) => {
  try {
    const { sensorNumber, spotName, lat, lng, createdAt, deletedAt, location } =
      req.body;
    const newSensor = await SensorModel.create({
      sensorNumber,
      spotName,
      lat,
      lng,
      createdAt,
      deletedAt,
      location,
    });
    res.status(201).send({ newSensor });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = sensorsRouter;
