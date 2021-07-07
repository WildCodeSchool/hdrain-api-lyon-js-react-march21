const { prisma } = require('../db');

const create = ({ code, sensor, sensorId, experimentId }) =>
  prisma.status.create({
    data: {
      code,
      sensor,
      sensorId,
      experimentId,
    },
  });

// Make a route to get all statuses
// const findAllStatuses = (sensorId) =>
//   prisma.status.findAllStatuses({
//     where: {
//       sensorId: parseInt(sensorId, 10),
//     },
//   });

const findUnique = async (sensorId, experimentId) => {
  const [status] = await prisma.status.findMany({
    where: {
      sensorId: parseInt(sensorId, 10),
      experimentId: parseInt(experimentId, 10),
    },
  });
  return status;
};

module.exports = { create, findUnique };
