const { prisma } = require('../db');

const create = async ({
  locationId,
  sensorNumber,
  spotName,
  lat,
  lng,
  timestamp,
}) =>
  prisma.sensor.create({
    data: {
      sensorNumber,
      spotName,
      lat,
      lng,
      createdAt: timestamp,
      locationId,
    },
  });

// store/not sensors from HD Rain
const createSensors = async (sensorsPosition, locationId, timestamp) => {
  // array that will receive the final results
  const storedSensorsList = [];
  const sensorsToStore = Object.entries(sensorsPosition);
  await Promise.all(
    sensorsToStore.map(async (sensor) => {
      const [key, value] = sensor;
      const sensorKey = parseInt(key, 10);
      const { latitude: lat, longitude: lng, lieux: spotName } = value;
      // function to store sensors in the db
      const storedInTheDb = await create({
        sensorKey,
        spotName,
        lat,
        lng,
        timestamp,
        locationId,
      });
      return storedSensorsList.push(storedInTheDb);
    })
  );

  return storedSensorsList;
};

const findAll = () => prisma.sensor.findMany();

const findAllFromExperiment = (experimentId) =>
  prisma.sensor.findMany({
    where: {
      experimentId: parseInt(experimentId, 10),
    },
  });

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

// Create a function to check if a sensor already exists in the DB
const sensorDoesNotExist = async (locationId, sensorNumber) =>
  !(await prisma.sensor.findFirst({
    where: {
      locationId: parseInt(locationId, 10),
      sensorNumber,
    },
  }));

module.exports = {
  createSensors,
  findAll,
  findUnique,
  findAllFromLocation,
  sensorDoesNotExist,
  findAllFromExperiment,
};
