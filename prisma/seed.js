const faker = require('faker');
const { fake } = require('faker/locale/zh_TW');

const { prisma } = require('../db');
const Experiment = require('../models/ExperimentModel');
const Location = require('../models/LocationModel');
const Sensor = require('../models/SensorModel');
const User = require('../models/UserModel');

module.exports = async function seed() {
  const hashedPassword = await User.hashPassword('hdr');

  await prisma.user.create({
    data: {
      username: 'Root',
      hashedPassword,
    },
  });

  let location;
  let sensors;

  const experiments = await Promise.all(
    Array(10)
      .fill()
      .map(() =>
        prisma.experiment.create({
          data: {
            timestamp: new Date(),
            log: faker.lorem.words(),
            rainGraph: 'path/to/rainGraph',
            costGraph: 'path/to/costGraph',
            parameters: faker.lorem.paragraphs(),
            locationId: location.id,
          },
        })
      )
  );

  // eslint-disable-next-line prefer-const
  sensors = await prisma.sensors.createMany({
    data: Array(10)
      .fill(null)
      .map((_, index) => ({
        status: parseInt(Math.random() * 4, 10),
        lng: parseInt(Math.random() * 90, 10),
        lat: parseInt(Math.random() * 90, 10),
        spotName: faker.lorem.word(),
        sensorNumber: index,
        location,
        locationId: location.id,
      })),
  });

  location = await prisma.location.create({
    data: {
      name: 'Abidjan',
      lng: 5.316667,
      lat: -4.033333,
      experiments: experiments[0].id,
      sensors,
    },
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
