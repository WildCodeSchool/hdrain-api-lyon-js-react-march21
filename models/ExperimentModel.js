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
      log,
      rainGraph,
      costGraph,
      parameters,
      location,
      neuralNetworkLog,
      assimilationLog,
    },
  });

module.exports = create;
