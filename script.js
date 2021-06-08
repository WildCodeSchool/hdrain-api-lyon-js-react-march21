const shell = require('shelljs');

const copyData = () => {
  const date = new Date();
  console.log(date);
  shell.exec('colorls');
};

const copyDataPeriodically = () => {
  copyData();
  setInterval(() => {
    copyData();
  }, 1 * 60 * 1000);
};

copyDataPeriodically();
