const { prisma } = require('../db');

const create = ({
  timestamp,
  log,
  rainGraph,
  costGraph,
  parameter,
  location,
}) =>
  prisma.location.create({
    data: {
      timestamp,
      log,
      rainGraph,
      costGraph,
      parameter,
      location,
    },
  });

module.exports = create;
