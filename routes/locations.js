const locationsRouter = require('express').Router();
const { Location } = require('../models/Location');

// creating POST route
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
