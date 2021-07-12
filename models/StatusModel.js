const { prisma } = require('../db');

const createManyStatus = (newStatusList) => 
prisma.status.createMany({
    data: newStatusList,
  });

  const findUnique = async (sensorId, experimentId) => {
    const [status] = await prisma.status.findMany({
      where: {
        sensorId: parseInt(sensorId, 10),
        experimentId: parseInt(experimentId, 10),
      },
    });
    return status;
  };
module.exports = {createManyStatus, findUnique};
