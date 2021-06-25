const experimentsRouter = require('express').Router();
const ExperimentModel = require('../models/ExperimentModel');

experimentsRouter.get('/', async (req, res) => {
  const { locationId, timestamp } = req.query;
  const testDate = new Date(timestamp);

  // + new Date().getTimezoneOffset();

  console.log(locationId, testDate);
  try {
    // Retrieve all experiments from the DB
    const experiments = await ExperimentModel.findMany(locationId, testDate);
    res.status(200).send(experiments);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

experimentsRouter.post('/', async (req, res) => {
  try {
    const {
      timestamp,
      neuralNetworkLog,
      assimilationLog,
      rainGraph,
      costGraph,
      parameters,
      location,
    } = req.body;
    const newExperiment = await ExperimentModel.create({
      timestamp,
      neuralNetworkLog,
      assimilationLog,
      rainGraph,
      costGraph,
      parameters,
      location,
    });
    res.status(201).send({ newExperiment });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = experimentsRouter;
