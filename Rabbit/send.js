#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

// connect to RabbitMQ server
amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }

  // we create a channel, which is where most of the API for getting things done resides
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    // To send, we must declare a queue for us to send to; then we can publish a message to the queue
    const queue = 'hello';
    const msg = 'Hello world';

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(' [x] Sent %s', msg);
  });
  // Closing the connection and exit after a timeout
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
