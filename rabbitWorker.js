#!/usr/bin/env node
// require('dotenv').config();
const amqp = require('amqplib/callback_api');
const ExperimentModel = require('./models/ExperimentModel');
const StatusModel = require('./models/StatusModel');
const SensorModel = require('./models/SensorModel');

function rabbit() {
  // connect to RabbitMQ server
  amqp.connect(
    process.env.RABBIT_MQ_CONNECTION_STRING,
    (error0, connection) => {
      if (error0) {
        throw error0;
      }

      // we create a channel, which is where most of the API for getting things done resides
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        // To send, we must declare a queue for us to send to; then we can publish a message to the queue
        const queue = 'HDR_Monitoring';

        // This makes sure the queue is declared before attempting to consume from it
        channel.assertQueue(queue, {
          durable: true,
        });

        console.log(
          ' [*] Rabbit - Waiting for messages in %s. Press CTRL+C to exit',
          queue
        );

        channel.consume(
          queue,
          async (msg) => {
            const message = msg.content.toString().toLowerCase();
            // .replace(/\\n/g, ' ');

            console.log(message);
            try {
              const data = JSON.parse(message);

              // data to send in the database
              const experimentData = {
                timestamp: data.date.replace(/h/, '_').split('_'),
                assimilationLog: data['log assim'],
                neuralNetworkLog: data['log rn'],
                parameters: data.config,
                status: JSON.parse(data.statuts),
              };

              // change date fortmat
              experimentData.timestamp = new Date(
                experimentData.timestamp[0],
                experimentData.timestamp[1],
                experimentData.timestamp[2],
                experimentData.timestamp[3],
                experimentData.timestamp[4]
              );

              // show results
              console.log(' [x] Received: ', experimentData);

              // store in DB
              if (!experimentData) {
                console.log('Error: wrong data sent');
              } else if (
                await ExperimentModel.experimentAlreadyExists(experimentData)
              ) {
                console.log('Error: experiment already saved in the database');
              } else {
                // add missing element
                experimentData.locationId = 1;
                experimentData.rainGraph = '/path';
                experimentData.costGraph = '/path';

                // send all elements to the database
                const {
                  timestamp,
                  neuralNetworkLog,
                  assimilationLog,
                  rainGraph,
                  costGraph,
                  parameters,
                  locationId,
                } = experimentData;

                const StoredExperiment = await ExperimentModel.create({
                  timestamp,
                  neuralNetworkLog,
                  assimilationLog,
                  rainGraph,
                  costGraph,
                  parameters,
                  locationId,
                });

                console.log('experiment stored in DB: ', StoredExperiment);
                // create sensors
                const assimilationArr = StoredExperiment.assimilationLog
                  .split('\n')
                  .filter(
                    (element) =>
                      element.includes('ets36') || element.includes('ses5')
                  );
                 

                console.log(assimilationArr);

                // create status for sensors
                const { status } = experimentData;

                // get all the sensors from a location
                const sensorsList = await SensorModel.findAllFromLocation(
                  locationId
                );

                // create a status for each sensor in this location
                sensorsList.forEach(async (sensor) => {
                  if (status[`${sensor.sensorNumber}`]) {
                    const newStatus = {
                      code: status[sensor.sensorNumber],
                      sensorId: sensor.id,
                      experimentId: StoredExperiment.id,
                    };

                    const storedStatus = await StatusModel.create(newStatus);

                    console.log('status added', storedStatus);
                  }
                });
              }
            } catch (error) {
              // console.error(error);
            }
          },
          {
            // automatic acknowledgment mode,
            noAck: false,
          }
        );
      });
    }
  );
}

module.exports = rabbit;
