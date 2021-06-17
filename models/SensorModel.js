const { prisma } = require('../db');

const create = ({
  sensorNumber,
  spotName,
  lat,
  lng,
  createdAt,
  deletedAt,
  status,
  location,
}) =>
  prisma.sensor.create({
    data: {
      sensorNumber,
      spotName,
      lat,
      lng,
      createdAt,
      deletedAt,
      status,
      location,
    },
  });

module.exports = create;
