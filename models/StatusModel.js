const { prisma } = require('../db');

const createManyStatus = (newStatusList) => 
prisma.status.createMany({
    data: newStatusList,
  });

  const findUnique = async (sensorId, experimentId) => await prisma.status.findFirst({
      where: {
        sensorId: parseInt(sensorId, 10),
        experimentId: parseInt(experimentId, 10),
      },
    });
module.exports = {createManyStatus, findUnique};
