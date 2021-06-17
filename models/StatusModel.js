const { prisma } = require('../db');

const create = ({ timestampStatus, statusCode, sensor }) =>
  prisma.sensor.create({
    data: {
      timestampStatus,
      statusCode,
      sensor,
    },
  });

module.exports = create;
