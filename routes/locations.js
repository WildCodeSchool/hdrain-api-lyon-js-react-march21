const locationsRouter = require('express').Router();
const LocationModel = require('../models/LocationModel');

// Creating a new location in the DB
locationsRouter.post('/', async (req, res) => {
  try {
    const { name, coord } = req.body;

    const newLocation = await LocationModel.create({
      name,
      coord,
    });

    res
      .status(201)
      .send(`Success !! ⭐️ Location data was recorded : ${newLocation.name}`);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = locationsRouter;
