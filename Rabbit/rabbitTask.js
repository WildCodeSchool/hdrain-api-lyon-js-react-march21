require('dotenv').config();
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
    const msg = JSON.stringify({
      title: 'test',
      send: 'ok',
      timestamp: new Date(),
    });

    channel.assertQueue(queue, {
      durable: true,
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });
    console.log(' [x] Sent: ', JSON.parse(msg));
    // Closing the connection and exit after a timeout
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
