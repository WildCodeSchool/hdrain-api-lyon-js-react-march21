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

const findMany = () => prisma.sensor.findMany();
const findOne = (id) =>
  prisma.sensor.findUnique({ where: { id: parseInt(id, 10) } });

module.exports = { create, findMany, findOne };
