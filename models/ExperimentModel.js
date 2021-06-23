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

  const selectImg = (id) => prisma.experiment.findUnique({
    where: {
      id
    },
    select: {
      rainGraph: true,
    },
  })

module.exports = { create, update, selectImg };
