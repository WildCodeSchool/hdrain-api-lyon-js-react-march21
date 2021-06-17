const { prisma } = require('../db');

const findMany = () => prisma.location.findMany();

const findOne = (id) =>
  prisma.location.findFirst({ where: { id: parseInt(id, 10) } });

const create = ({ name, lat, lng, updatedAt, sensors, experiments }) =>
  prisma.location.create({
    data: {
      name,
      lat,
      lng,
      updatedAt,
      sensors,
      experiments,
    },
  });

module.exports = {
  findMany,
  findOne,
  create,
};
