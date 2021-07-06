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

// const getRainGraph = (experiment) => ({
//   ...experiment,
//   rainGraph: `${API_BASE_URL}/${experiment.rainGraph}`,
// });

// function to get all the info related to one experiment but also to extract the expected url
// if an url exist, make it precede of the localhost:5000 to get absolute url
const getImagesURL = (experiment) => {
  let rainGraph = experiment?.rainGraph;
  let costGraph = experiment?.costGraph;
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

module.exports = {
  // findMany,
  findExperimentByTimestamp,
  create,
  update,
  selectFile,
  getImagesURL,
};
