const { prisma } = require('../db');

const create = ({ code, sensor, experiment }) =>
  prisma.sensor.create({
    data: {
      code,
      sensor,
      experiment,
    },
  });

module.exports = create;
