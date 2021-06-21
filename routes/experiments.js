const experimentsRouter = require('express').Router();
const ExperimentModel = require('../models/ExperimentModel');

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
