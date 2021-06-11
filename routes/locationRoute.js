const locationRouter = require('express').Router();

const LocationModel = require('../models/LocationModel');

locationRouter.post('/', async (req, res) => {
  const { name, coord } = req.body;

  const newLocation = await LocationModel.create({
    name,
    coord,
  });

  return res.status(201).send({ newLocation });
});


module.exports = locationRouter;