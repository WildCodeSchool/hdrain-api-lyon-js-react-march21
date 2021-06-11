const sensorsRouter = require('express').Router();
const SensorModel = require('../models/SensorModel');

sensorsRouter.post('/', async (req, res) => {
  try {
    const { sensorNumber, coord, status } = req.body;
    const newSensor = await SensorModel.create({
      sensorNumber,
      coord,
      status,
    });
    res.status(201).send({ newSensor });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = sensorsRouter;
