const { prisma } = require('../db');

const create = ({
  timestamp,
  neuralNetworkLog,
  assimilationLog,
  rainGraph,
  costGraph,
  parameters,
  location,
}) =>
  prisma.location.create({
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

const createManyExperiments = (array) =>
  prisma.experiment.createMany({
    data: array,
  });

// Get all timestamps returns an object with keys = every timestamp and values = true
const getAllTimestamps = async () => {
  const experiments = await prisma.experiment.findMany();
  return Object.fromEntries(
    experiments.map(({ timestamp }) => [timestamp.toISOString(), true])
  );
};

module.exports = {
  create,
  update,
  selectFile,
  getAllTimestamps,
  createManyExperiments,
};
