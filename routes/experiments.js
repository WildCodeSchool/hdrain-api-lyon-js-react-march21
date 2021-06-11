const experimentsRouter = require('express').Router();
const ExperimentModel = require('../models/ExperimentModel');

experimentsRouter.post('/', async (req, res) => {
  try {
    const { timestamp, log, diagnosticGraph, costGraph } = req.body;
    const newExperiment = await ExperimentModel.create({
      timestamp,
      log,
      diagnosticGraph,
      costGraph,
    });
    res.status(201).send({ newExperiment });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = experimentsRouter;
