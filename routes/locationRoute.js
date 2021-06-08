const locationRouter = require('express').Router();

const LocationModel = require('../models/LocationsModel');

locationRouter.post('/', async (req, res) => {
  const { name, coord, sensors, experiences } = req.body;

  const newLocation = await LocationModel.create({
    name,
    coord,
    sensors,
    experiences,
  });

  return res.status(201).send({ newLocation });
});


module.exports = locationRouter;