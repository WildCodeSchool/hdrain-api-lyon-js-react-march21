#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

// connect to RabbitMQ server
amqp.connect(process.env.RABBIT_MQ_CONNECTION_STRING, (error0, connection) => {
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

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

    channel.consume(
      queue,
      (msg) => {
        const content = JSON.parse(msg.content);
        console.log(' [x] Received: ', content);
        console.log(content.timestamp);
      },
      {
        // automatic acknowledgment mode,
        // see ../confirms.html for details
        noAck: false,
      }
    );
  });
});
