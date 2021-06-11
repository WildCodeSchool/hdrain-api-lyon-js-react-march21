const experimentsRouter = require('express').Router();
const ExperimentModel = require('../models/ExperimentModel');

experimentsRouter.post('/', async (req, res) => {
  const { timestamp, log, diagnosticGraph, costGraph } = req.body;

  const newExperiment = await ExperimentModel.create({
    timestamp,
    log,
    diagnosticGraph,
    costGraph,
  });

  return res.status(201).send({ newExperiment });
});

module.exports = experimentsRouter;
