const { prisma } = require('../db');

const findMany = (locationId, timestamp) =>
  prisma.experiment.findMany({
    where: { locationId: parseInt(locationId, 10), timestamp },
  });

const findOne = (id) =>
  prisma.experiment.findUnique({ where: { id: parseInt(id, 10) } });

const create = ({
  timestamp,
  neuralNetworkLog,
  assimilationLog,
  rainGraph,
  costGraph,
  parameters,
  location,
}) =>
  prisma.experiment.create({
    data: {
      timestamp,
      neuralNetworkLog,
      assimilationLog,
      rainGraph,
      costGraph,
      parameters,
      location,
    },
  });

module.exports = {
  findMany,
  findOne,
  create,
};
