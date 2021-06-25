const experimentsRouter = require('express').Router();
const ExperimentModel = require('../models/ExperimentModel');

experimentsRouter.get('/', async (req, res) => {
  try {
    // Retrieve all experiments from the DB
    const experiments = await ExperimentModel.findMany();
    if (!experiments.length) res.status(404).send('No experiment found');
    // Send the result
    res.status(200).send(experiments);
  } catch (error) {
    res.status(500).send(error);
  }
});

experimentsRouter.get('/:experimentsId', async (req, res) => {
  try {
    const {experimentsId} = req.params;
    // Retrieve specific sensor from the DB
    const experiment = await ExperimentModel.findOne(experimentsId);
    if (!experiment) return res.status(404).send('No experiment found');
    // Send the result
    return res.status(200).send(experiment);
  } catch (error) {
    return res.status(500).send(error);
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
