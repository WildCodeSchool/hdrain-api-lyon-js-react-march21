const shell = require('shelljs');
require('dotenv').config();

const destinationPathList = process.env.HD_RAIN_LOCATION_LIST.split(',');
const serverAddressList = process.env.HD_RAIN_SERVER_LIST.split(',');

const target = process.env.LOCAL_TARGET;
const source = process.env.HD_RAIN_SOURCE;

// Returns a shell command to copy the file server's content to our server (using rsync through ssh)
const command = (path, address) =>
  ` rsync -vrzh --rsh='sshpass -p ${process.env.HD_RAIN_SERVER_PWD} ssh -o "StrictHostKeyChecking no"' wild@${address}:${source} ${target}${path}`;

// Interval in milliseconds
const interval = 5 * 60 * 1000;
let intervalId = null;

// Function to execute the shell command to copy the data to our server
const copyData = (cmd) => {
  console.log(new Date());
  shell.exec(cmd);
};

// Function to start the periodic copy of files every 5 minutes
const copyDataPeriodically = () => {
  intervalId = setInterval(() => {
    destinationPathList.forEach((path, index) => {
      copyData(command(path, serverAddressList[index]));
    });
  }, interval);
  console.log(`Interval was started with ID: ${intervalId}`);
};

// Function to stop the periodic copy of files
const stopCopyingData = () => {
  clearInterval(intervalId);
  console.log(`Interval ${intervalId} was stopped`);
};

module.exports = {
  copyDataPeriodically,
  copyData,
  stopCopyingData,
};

// To install sshpass on Linux: apt-get install sshpass
