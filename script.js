const shell = require('shelljs');

// Shell command to copy the file server's content to our server
const command =
  'rsync -vrzh wild@51.178.56.162:/home/wild/LOG/2021/05/20/18h50 ~/Downloads';

let intervalId = null;

// Function to execute the shell command to copy the data to our server
const copyData = () => {
  const date = new Date();
  console.log(date);
  shell.exec(command);
};

// Function to start the periodic copy of files
const copyDataPeriodically = () => {
  copyData();
  intervalId = setInterval(() => {
    copyData();
  }, 1 * 60 * 1000);
  console.log(`Data copy interval was started with ID: ${intervalId}`);
};

// Function to stop the periodic copy of files
const stopCopyingData = () => {
  clearInterval(intervalId);
  console.log(`Interval ${intervalId} was stopped`);
};

copyDataPeriodically();

module.exports = {
  copyDataPeriodically,
  copyData,
  stopCopyingData,
};
