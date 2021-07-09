const { prisma } = require('../db');

const create = ({
  sensorNumber,
  spotName,
  lat,
  lng,
  createdAt,
  deletedAt,
  locationId,
}) =>
  prisma.sensor.create({
    data: {
      sensorNumber,
      spotName,
      lat,
      lng,
      createdAt,
      deletedAt,
      locationId,
    },
  });

const findAll = () => prisma.sensor.findMany();

const findAllFromLocation = (locationId) =>
  prisma.sensor.findMany({
    where: {
      locationId: parseInt(locationId, 10),
    },
  });

const findUnique = (sensorId) =>
  prisma.sensor.findUnique({
    where: {
      id: parseInt(sensorId, 10),
    },
  });

module.exports = { create, findAll, findUnique, findAllFromLocation };
