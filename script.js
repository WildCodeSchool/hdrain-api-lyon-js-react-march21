const shell = require('shelljs');

const localLocationList = ['/Abidjan', '/Toulouse', '/Antibe'];
const serverAddress = ['51.178.56.162', '...', '...'];

// Shell command to copy the file server's content to our server (using ssh)
const command =
  ' rsync -vrzh --rsh=ssh wild@51.178.56.162:/home/wild/LOG/2021/05/20/18h50 ~/Downloads';

// Interval in milliseconds
const interval = 5 * 60 * 1000;
let intervalId = null;

// Function to execute the shell command to copy the data to our server
const copyData = () => {
  console.log(new Date());
  shell.exec(command);
};

// Function to start the periodic copy of files every 5 minutes
const copyDataPeriodically = () => {
  copyData();
  intervalId = setInterval(() => {
    copyData();
  }, interval);
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
