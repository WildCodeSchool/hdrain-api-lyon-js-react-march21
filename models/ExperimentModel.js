const { prisma } = require('../db');
const { API_BASE_URL } = require('../env');

// const findMany = (locationId, timestamp) =>
//   prisma.experiment.findMany({
//     where: { locationId: parseInt(locationId, 10), timestamp },
//   });

const findExperimentByTimestamp = async (locationId, timestamp) => {
  const [response] = await prisma.experiment.findMany({
    where: {
      locationId: parseInt(locationId, 10),
      timestamp,
    },
  });
  return response;
};

const experimentAlreadyExists = (experiment) =>
  prisma.experiment.findFirst({
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

// function to get all the info related to one experiment but also to extract the expected url
// if an url exist, make it precede of the localhost:5000 to get absolute url
const getImagesURL = (experiment) => {
  let rainGraph = experiment ? experiment.rainGraph : undefined;
  let costGraph = experiment ? experiment.costGraph : undefined;
  if (
    rainGraph &&
    !rainGraph.startsWith('http://') &&
    !rainGraph.startsWith('https://')
  ) {
    rainGraph = `${API_BASE_URL}/${rainGraph}`;
  }
  if (
    costGraph &&
    !costGraph.startsWith('http://') &&
    !costGraph.startsWith('https://')
  ) {
    costGraph = `${API_BASE_URL}/${costGraph}`;
  }
  return {
    ...experiment,
    rainGraph,
    costGraph,
  };
};

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
  experimentAlreadyExists,
  getAllTimestamps,
  createManyExperiments,
  findExperimentByTimestamp,
  getImagesURL,
};
