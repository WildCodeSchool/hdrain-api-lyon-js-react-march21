const locationsRouter = require('express').Router();
const { Location } = require('../models/Location');

// Get all the locations
locationsRouter.get('/', async (req, res) => {
  try {
    // Retrieve all locations from the DB
    const locations = await Location.find();
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
    const location = await Location.findOne({ _id: locationId });
    if (!location) res.status(404).send('No location found');
    // Send the result
    res.status(200).send(location);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Creating POST route
locationsRouter.post('/', async (req, res) => {
  try {
    const {
      name,
      assimilationLog,
      rainMap,
      config,
      diags,
      inferenceLog,
      sensorStatus,
    } = req.body;
    const newLocation = new Location({
      name,
      assimilationLog,
      rainMap,
      config,
      diags,
      inferenceLog,
      sensorStatus,
    });
    const saveLocation = await newLocation.save();
    res
      .status(201)
      .send(`Success !! ⭐️ Location data was recorded : ${saveLocation.name}`);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = locationsRouter;
