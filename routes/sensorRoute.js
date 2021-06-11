const sensorRouter = require('express').Router();

const SensorModel = require('../models/SensorModel');

sensorRouter.post('/', async (req, res) => {
  const { sensorNumber, coord, status } = req.body;

  const newSensor = await SensorModel.create({
    sensorNumber,
    coord,
    status,
  });

  return res.status(201).send({ newSensor });
});

module.exports = sensorRouter;
