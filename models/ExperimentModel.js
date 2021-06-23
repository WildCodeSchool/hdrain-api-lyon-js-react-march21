const { prisma } = require('../db');

const findMany = () => prisma.experiment.findMany();

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
