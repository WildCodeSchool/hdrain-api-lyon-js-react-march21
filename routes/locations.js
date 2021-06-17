const locationsRouter = require('express').Router();
const LocationModel = require('../models/LocationModel');

// Get all the locations
locationsRouter.get('/', async (req, res) => {
  try {
    // Retrieve all locations from the DB
    const locations = await LocationModel.findMany();
    if (!locations.length) res.status(404).send('No locations found');
    // Send the result
    res.status(200).send(locations);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get one location by its id
locationsRouter.get('/:id', async (req, res) => {
  try {
    const locationId = req.params.id;
    // Retrieve specific location from the DB
    const location = await LocationModel.findOne(locationId);
    if (!location) return res.status(404).send('No location found');
    // Send the result
    return res.status(200).send(location);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = locationsRouter;
