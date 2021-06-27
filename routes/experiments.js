const experimentsRouter = require('express').Router();
const ExperimentModel = require('../models/ExperimentModel');

experimentsRouter.get('/', async (req, res) => {
  const { locationId } = req.params;
  const { timestamp } = req.query;

  try {
    // Retrieve all experiments from the DB

    const experiments = await ExperimentModel.findMany(
      locationId,
      new Date(timestamp)
    );
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
