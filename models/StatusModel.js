const { prisma } = require('../db');

const createManyStatus = (newStatusList) => 
prisma.status.createMany({
    data: newStatusList,
  });

module.exports = {createManyStatus};
