#!/usr/bin/env node
// require('dotenv').config();
const amqp = require('amqplib/callback_api');
const ExperimentModel = require('./models/ExperimentModel');

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
            const message = msg.content
              .toString()
              .toLowerCase()
              .replace(/\\n/g, ' ');
            try {
              const data = JSON.parse(message);

              // need the key names to match the db 
              const newData = {
                timestamp: data.date.replace(/h/, '_').split('_'),
                assimilationLog: data['log assim'],
                neuralNetworkLog: data['log rn'],
                parameters: data.config,
                status: JSON.parse(data.statuts),
              };
              
              // change date fortmat
              newData.timestamp = new Date(newData.timestamp[0], newData.timestamp[1], newData.timestamp[2], newData.timestamp[3], newData.timestamp[4]);
              
              // show result
              console.log(' [x] Received: ', newData);

              // store in DB
              if (!newData) {
                console.log('Error: wrong data sent');
              } else if (
                await ExperimentModel.experimentAlreadyExists(newData)
              ) {
                console.log('Error: experiment already saved in the database');
              } else {
                newData.locationId = 1;
                newData.rainGraph = '/path';
                newData.costGraph = '/path';
        

                const {
                  timestamp,
                  neuralNetworkLog,
                  assimilationLog,
                  rainGraph,
                  costGraph,
                  parameters,
                  locationId,
                } = newData;

                const newExperiment = await ExperimentModel.create({
                  timestamp,
                  neuralNetworkLog,
                  assimilationLog,
                  rainGraph,
                  costGraph,
                  parameters,
                  locationId,
                });

                console.log('experiment stored in DB: ', newExperiment);
              };
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
