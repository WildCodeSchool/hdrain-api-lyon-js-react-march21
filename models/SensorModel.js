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

const findMany = () => prisma.sensor.findMany();
const findUnique = (id) =>
  prisma.sensor.findUnique({ where: { id: parseInt(id, 10) } });

module.exports = { create, findMany, findUnique };
