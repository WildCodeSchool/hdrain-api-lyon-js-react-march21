const locationsRouter = require('express').Router();
const LocationModel = require('../models/LocationModel');
const SensorModel = require('../models/SensorModel');
const ExperimentModel = require('../models/ExperimentModel');
const StatusModel = require('../models/StatusModel');

// LOCATIONS

// Get all the locations
locationsRouter.get('/', async (req, res) => {
  try {
    // Retrieve all locations from the DB
    const locations = await LocationModel.findMany();
    if (!locations.length) res.status(404).send('No locations found');
    else res.status(200).send(locations);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Get one location by its id
locationsRouter.get('/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;
    // Retrieve specific location from the DB
    const location = await LocationModel.findUnique(locationId);
    // Send the result
    res.status(200).send(location);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// SENSORS

// Get all sensors from a location
locationsRouter.get('/:locationId/sensors', async (req, res) => {
  const { locationId } = req.params;
  try {
    // Retrieve specific sensor from the DB
    const sensors = await SensorModel.findAllFromLocation(locationId);
    if (!sensors.length) res.status(404).send('No sensor found');
    else res.status(200).send(sensors);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Get one sensor by its id from a location
locationsRouter.get('/:locationId/sensors/:sensorId', async (req, res) => {
  const { sensorId } = req.params;
  try {
    // Retrieve specific sensor from the DB
    const sensor = await SensorModel.findUnique(sensorId);
    res.status(200).send(sensor);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Create a sensor in a location
locationsRouter.post('/:locationId/sensors', async (req, res) => {
  const { locationId } = req.params;
  try {
    const { sensorNumber, spotName, lat, lng, createdAt, deletedAt } = req.body;
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
    console.error(error);
    res.status(500).send(error);
  }
});

// Get experiment at a single timestamp from a location
locationsRouter.get('/:locationId/experiments', async (req, res) => {
  const { locationId } = req.params;
  const timestamp = new Date(req.query.timestamp);
  console.log(timestamp);
  try {
    // Retrieve all experiment of a given location from the DB
    const experiment = await ExperimentModel.findExperimentByTimestamp(
      locationId,
      timestamp
    );
    res.status(200).send(experiment);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// EXPERIMENTS

// Get all experiments from a location
// locationsRouter.get('/:locationId/experiments', async (req, res) => {
//   const { locationId } = req.params;
//   try {
//     // Retrieve all experiments of a given location from the DB
//     const experiments = await ExperimentModel.findMany(locationId);
//     res.status(200).send(experiments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// });

// STATUS
locationsRouter.get('/:locationId/sensors/status', async (req, res) => {
  const { experimentId } = req.query;
  const { locationId } = req.params;
  console.log(experimentId, locationId);
  try {
    const sensors = await SensorModel.findAllFromLocation(locationId);
    const sensorsId = sensors.map((sensor) => sensor.id);
    const statusList = await Promise.all(
      sensorsId.map((id) => StatusModel.findUnique(id, experimentId))
    );
    res.status(200).send(statusList);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = locationsRouter;
