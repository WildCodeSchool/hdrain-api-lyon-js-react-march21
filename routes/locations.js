const locationsRouter = require('express').Router();
const { Location } = require('../models/Locations');

// creating POST route
locationsRouter.post('/', async (req, res) => {
  try {
    const {
      name,
      assimilationlog,
      rainmap,
      config,
      diags,
      inferencelog,
      sensorstatus,
    } = req.body;
    const newLocation = new Location({
      name,
      assimilationlog,
      rainmap,
      config,
      diags,
      inferencelog,
      sensorstatus,
    });
    const saveLocation = await newLocation.save();
    res
      .status(201)
      .send(`Success !! ⭐️ Location data was recorded : ${saveLocation}`);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = locationsRouter;
