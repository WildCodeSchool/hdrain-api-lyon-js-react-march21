const { prisma } = require('../db');

const create = ({ sensorNumber, spotName, lat, lng, status, location }) =>
  prisma.sensor.create({
    data: {
      sensorNumber,
      spotName,
      lat,
      lng,
      status,
      location,
    },
  });

module.exports = create;
