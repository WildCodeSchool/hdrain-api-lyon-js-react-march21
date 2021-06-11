const experienceRouter = require('express').Router();

const ExperienceModel = require('../models/ExperienceModel');

experienceRouter.post('/', async (req, res) => {
  const { timestamp, log, diagnosticGraph, costGraph } = req.body;

  const newExperience = await ExperienceModel.create({
    timestamp,
    log,
    diagnosticGraph,
    costGraph,
  });

  return res.status(201).send({ newExperience });
});

module.exports = experienceRouter;
