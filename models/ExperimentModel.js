const { prisma } = require('../db');

const findMany = (locationId, timestamp) =>
  prisma.experiment.findMany({
    where: { locationId: parseInt(locationId, 10), timestamp },
  });

const findExperimentByTimestamp = (locationId, timestamp) =>
  prisma.experiment.findUnique({
    where: {
      locationId: parseInt(locationId, 10),
      timestamp,
    },
  });

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

const update = (id, path) =>
  prisma.experiment.update({
    where: {
      id,
    },
    data: {
      rainGraph: `${path}`,
    },
  });

const selectFile = (id) =>
  prisma.experiment.findUnique({
    where: {
      id,
    },
    select: {
      rainGraph: true,
    },
  });

module.exports = {
  findMany,
  findExperimentByTimestamp,
  create,
  update,
  selectFile,
};
