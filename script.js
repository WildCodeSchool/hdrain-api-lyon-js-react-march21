const cron = require('node-cron');
const shell = require('shelljs');

cron.schedule('0 * * * * *', () => {
  console.log('cron job running...');
  shell.exec('ls');
});
