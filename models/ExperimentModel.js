const { prisma } = require('../db');

// const findMany = (locationId, timestamp) =>
//   prisma.experiment.findMany({
//     where: { locationId: parseInt(locationId, 10), timestamp },
//   });

const findExperimentByTimestamp = (locationId, timestamp) =>
  prisma.experiment.findMany({
    where: {
      locationId: parseInt(locationId, 10),
      timestamp,
    },
  });

const experimentAlreadyExists = (experiment) => prisma.experiment.findFirst({
    where: { timestamp: experiment.timestamp },
  });

const create = ({
  timestamp,
  neuralNetworkLog,
  assimilationLog,
  rainGraph,
  costGraph,
  parameters,
  locationId,
}) =>
  prisma.experiment.create({
    data: {
      timestamp,
      neuralNetworkLog,
      assimilationLog,
      rainGraph,
      costGraph,
      parameters,
      locationId,
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
  // findMany,
  findExperimentByTimestamp,
  create,
  update,
  selectFile,
  experimentAlreadyExists,
};
