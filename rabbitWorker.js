#!/usr/bin/env node
/* eslint-disable no-unused-vars */
const amqp = require('amqplib/callback_api');
const storeData = require('./storeRabbitData');

function connexion() {
  // connect to RabbitMQ server
  amqp.connect(
    process.env.RABBIT_MQ_CONNECTION_STRING_TEST,
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
          // maxLength: 300,
        });

        console.log(
          ' [*] Rabbit - Waiting for messages in %s. Press CTRL+C to exit',
          queue
        );

        channel.consume(
          queue,
          async (msg) => {
            const message = msg.content.toString('utf8').toLowerCase();
            try {
              const rabbitMqData = JSON.parse(message);
              storeData(rabbitMqData);
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

module.exports = connexion;
