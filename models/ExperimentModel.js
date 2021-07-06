const { prisma } = require('../db');
const { API_BASE_URL } = require('../env');

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
  let { rainGraphUrl } = experiment;
  if (
    rainGraphUrl &&
    !rainGraphUrl.startsWith('http://') &&
    !rainGraphUrl.startsWith('https://')
  ) {
    rainGraphUrl = `${API_BASE_URL}/${rainGraphUrl}`;
  }
  return {
    ...experiment,
    rainGraphUrl,
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
