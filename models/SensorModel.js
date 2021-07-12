const { prisma } = require('../db');

// store/not sensors from HD Rain
const createSensors = async (sensorsPosition, locationId, timestamp) => {
  // array that will receive the final results
  const storedSensorsList = [];
  const sensorsToStore = Object.entries(sensorsPosition);

  await Promise.all(sensorsToStore.map(async (sensor) => {
    const sensorKey = parseInt(key, 10);
    const { latitude: lat, longitude: lng, lieux: spotName } = value;

    // function to store sensors in the db
    const storingInTheDb = await prisma.sensor.create({
      data: {
        sensorNumber: sensorKey,
        spotName,
        lat,
        lng,
        createdAt: timestamp,
        locationId,
      },
    });
    return storedSensorsList.push(storingInTheDb);
  }));

  return storedSensorsList;
};

const findAll = () => prisma.sensor.findMany();

const findAllFromLocation = (locationId) =>
  prisma.sensor.findMany({
    where: {
      locationId: parseInt(locationId, 10),
    },
  });

const findUnique = (sensorId) =>
  prisma.sensor.findUnique({
    where: {
      id: parseInt(sensorId, 10),
    },
  });

module.exports = {
  createSensor,
  findAll,
  findUnique,
  findAllFromLocation,
};
