const locationsRouter = require('express').Router();
const LocationModel = require('../models/LocationModel');

// Get all the locations
locationsRouter.get('/', async (req, res) => {
  try {
    // Retrieve all locations from the DB
    const locations = await LocationModel.find();
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
    // Check that the id is correct (long enough)
    if (locationId.length !== 24) res.status(422).send('Invalid location id');
    // Retrieve specific location from the DB
    const location = await LocationModel.findOne({ _id: locationId });
    if (!location) res.status(404).send('No location found');
    // Send the result
    res.status(200).send(location);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update one location
locationsRouter.patch('/:id', async (req, res) => {
  const locationId = req.params.id;
  const payload = req.body;
  try {
    // Check that the id is correct (long enough)
    if (locationId.length !== 24) res.status(422).send('Invalid location id');
    // Retrieve specific location from the DB
    const location = await LocationModel.findOne({ _id: locationId });
    if (!location) res.status(404).send('No location found');
    // Update the location
    await LocationModel.updateOne({ _id: locationId }, payload);
    // Send the result
    res.status(204).send(location);
  } catch (error) {
    res.sendStatus(500).send(error);
  }
});

// Create a new location
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
