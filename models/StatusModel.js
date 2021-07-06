const { prisma } = require('../db');

const create = ({ code, sensor, experiment }) =>
  prisma.sensor.create({
    data: {
      code,
      sensor,
      experiment,
    },
  });

// Make a route to get all statuses

const findUnique = (sensorId, experimentId) =>
  prisma.status.findUnique({
    where: {
      sensorId: parseInt(sensorId, 10),
      experimentId: parseInt(experimentId, 10),
    },
  });

module.exports = { create, findUnique };
