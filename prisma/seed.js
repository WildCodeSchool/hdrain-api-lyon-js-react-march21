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

  const experiments = await Promise.all(
    Array(10)
      .fill(null)
      .map(() =>
        prisma.experiment.create({
          data: {
            timestamp: new Date(),
            neuralNetworkLog: faker.lorem.words(),
            assimilationLog: faker.lorem.words(),
            rainGraph: 'path/to/rainGraph',
            costGraph: 'path/to/costGraph',
            parameters: faker.lorem.paragraphs(),
            locationId: location.id,
          },
        })
      )
  );

  const sensors = await Promise.all(
    Array(10)
      .fill(null)
      .map((_, index) =>
        prisma.sensor.create({
          data: {
            lng: parseInt(Math.random() * 90, 10),
            lat: parseInt(Math.random() * 90, 10),
            createdAt: new Date(),
            deletedAt: new Date(),
            spotName: faker.lorem.word(),
            sensorNumber: index,
            locationId: location.id,
          },
        })
      )
  );

  await prisma.status.create({
    data: {
      code: parseInt(Math.random() * 2, 10),
      experimentId: experiments[4].id,
      sensorId: sensors[4].id,
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
