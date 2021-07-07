const { prisma } = require('../db');

const create = (newStatus) => {
  const { code, sensorId, experimentId } = newStatus;

  prisma.status.create({
    data: {
      code,
      sensorId,
      experimentId,
    },
  });
};

module.exports = create;
