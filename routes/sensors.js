const sensorsRouter = require('express').Router();
const SensorModel = require('../models/SensorModel');

sensorsRouter.post('/', async (req, res) => {
  const { sensorNumber, coord, status } = req.body;

  const newSensor = await SensorModel.create({
    sensorNumber,
    coord,
    status,
  });

  return res.status(201).send({ newSensor });
});

module.exports = sensorsRouter;
