const sensorsRouter = require('express').Router();
const SensorModel = require('../models/SensorModel');
// deletedAt to be handled (not null) ?

// Get all the locations
sensorsRouter.get('/all', async (req, res) => {
  try {
    // Retrieve all sensors from the DB
    const sensors = await SensorModel.findMany();
    if (!sensors.length) res.status(404).send('No sensors found');
    // Send the result
    res.status(200).send(sensors);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get one sensor by its id
sensorsRouter.get('/:sensorId', async (req, res) => {
  try {
    const {sensorId} = req.params;
    // Retrieve specific sensor from the DB
    const sensor = await SensorModel.findUnique(sensorId);
    if (!sensor) res.status(404).send('No sensor found');
    // Send the result
    res.status(200).send(sensor);
  } catch (error) {
    res.status(500).send(error);
  }
});

sensorsRouter.post('/create', async (req, res) => {
  try {
    const {
      sensorNumber,
      spotName,
      lat,
      lng,
      createdAt,
      deletedAt,
      locationId,
    } = req.body;
    const newSensor = await SensorModel.create({
      sensorNumber,
      spotName,
      lat,
      lng,
      createdAt,
      deletedAt,
      locationId,
    });
    res.status(201).send(newSensor);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = sensorsRouter;
