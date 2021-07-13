// const faker = require('faker');

const { prisma } = require('../db');

const User = require('../models/UserModel');

module.exports = async function seed() {
  await User.create({
    username: 'test',
    password: 'test',
  });

  await prisma.location.create({
    data: {
      name: 'Abidjan',
      lng: -4.033333,
      lat: 5.316667,
    },
  });

  await prisma.location.create({
    data: {
      name: 'Antibes',
      lng: 7.125102,
      lat: 43.580418,
    },
  });

  await prisma.location.create({
    data: {
      name: 'Toulouse',
      lng: 1.433333,
      lat: 43.6,
    },
  });
};

//   const experiments = await Promise.all(
//     Array(5)
//       .fill(null)
//       .map((_, index) =>
//         prisma.experiment.create({
//           data: {
//             timestamp: new Date(2021, 5, 12 + index, 18, 45),
//             neuralNetworkLog: faker.lorem.words(),
//             assimilationLog: faker.lorem.words(),
//             rainGraph: 'path/to/rainGraph',
//             costGraph: 'path/to/costGraph',
//             parameters: faker.lorem.paragraphs(),
//             locationId: location.id,
//           },
//         })
//       )
//   );

//   const sensors = await Promise.all(
//     Array(10)
//       .fill(null)
//       .map((_, index) =>
//         prisma.sensor.create({
//           data: {
//             lng: parseInt(Math.random() * 90, 10),
//             lat: parseInt(Math.random() * 90, 10),
//             createdAt: new Date(),
//             deletedAt: new Date(),
//             spotName: faker.lorem.word(),
//             sensorNumber: index,
//             locationId: location.id,
//           },
//         })
//       )
//   );

//   await prisma.status.create({
//     data: {
//       code: parseInt(Math.random() * 2, 10),
//       experimentId: experiments[4].id,
//       sensorId: sensors[4].id,
//     },
//   });
// };
module
  .exports()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
