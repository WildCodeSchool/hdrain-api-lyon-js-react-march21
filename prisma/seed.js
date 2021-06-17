const faker = require('faker');

const { prisma } = require('../db');
// const Experiment = require('../models/ExperimentModel');
// const Location = require('../models/LocationModel');
// const Sensor = require('../models/SensorModel');
// const Status = require('../models/StatusModel');
const User = require('../models/UserModel');

module.exports = async function seed() {
  const hashedPassword = await User.hashPassword('hdr');

  await prisma.user.create({
    data: {
      username: 'So',
      hashedPassword,
    },
  });

  const location = await prisma.location.create({
    data: {
      name: 'Abidjan',
      lng: 5.316667,
      lat: -4.033333,
    },
  });

  await prisma.experiment.createMany({
    data: Array(10)
      .fill(null)
      .map(() => ({
        timestamp: new Date(),
        neuralNetworkLog: faker.lorem.words(),
        assimilationLog: faker.lorem.words(),
        rainGraph: 'path/to/rainGraph',
        costGraph: 'path/to/costGraph',
        parameters: faker.lorem.paragraphs(),
        locationId: location.id,
      })),
  });

  await prisma.sensors.createMany({
    data: Array(10)
      .fill(null)
      .map((_, index) => ({
        status: parseInt(Math.random() * 2, 10),
        lng: parseInt(Math.random() * 90, 10),
        lat: parseInt(Math.random() * 90, 10),
        createdAt: new Date(),
        deletedAt: new Date(),
        spotName: faker.lorem.word(),
        sensorNumber: index,
        locationId: location.id,
      })),
  });

  await prisma.status.createMany({
    data: Array(3)
      .fill(null)
      .map((_, index) => ({
        code: index,
        experimentId: location.id,
        sensorId: location.id,
      })),
  });
};

module
  .exports()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
