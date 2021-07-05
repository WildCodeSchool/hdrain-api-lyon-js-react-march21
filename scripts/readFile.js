const fs = require('fs');
const util = require('util');
const path = require('path');
const globCB = require('glob');

// Convert `fs.readFile()` into a function that takes the
// same parameters but returns a promise.
const readFile = util.promisify(fs.readFile);
const fileStats = util.promisify(fs.stat);
const glob = util.promisify(globCB);

const mainPath = './storage/data/**/*';

const readArrayFromFile = async (pathToFile) => {
  try {
    const buffer = await readFile(pathToFile);
    return buffer.toString('utf8').trim().split('\n').map(Number);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const readStationStatusFromFile = async (pathToFile) => {
  try {
    const buffer = await readFile(pathToFile);
    return JSON.parse(buffer);
  } catch (error) {
    console.error(error);
    return { error };
  }
};

function getDateFromFileDirectory(file) {
  const directory = path.dirname(file);
  const [directoryDate] = directory.match(/(\d{4})+.{12}/g);
  const splitDirectoryDate = directoryDate.split('/');
  const [hour, minutes] = splitDirectoryDate[3].split('h');
  const [year, month, day] = splitDirectoryDate;
  return new Date(year, month, day, hour, minutes);
}

const saveFilesToDB = async (pathToFiles) => {
  try {
    const files = await glob(pathToFiles);
    files.forEach(async (file) => {
      const stats = await fileStats(file);
      if (stats.isFile()) {
        const fileName = path.basename(file);
        const date = getDateFromFileDirectory(file);
        // TODO: get the locationId from the server's name sending the data, how ?
        // TODO: extract the following steps to a global scope function with arguments : date, location...
        if (fileName === 'statut_stations.log') {
          console.log(date);
          // Check if the DB already has an entry for this experiment
          // Parse the file and save the content to the DB in the sensors status for the given experiment
          const stationsStatus = await readStationStatusFromFile(file);
          console.log(stationsStatus);
        }
        if (fileName === 'JNL') {
          // Check if the DB already has an entry for this experiment
          // Parse the file and save the content to the DB (upsert ? locally update / create the value of x, y1, y2 || appending function ?) in the experiment rain graph data
          const JNL = await readArrayFromFile(file);
          console.log(JNL);
        }
        if (fileName === 'Jb') {
          // Check if the DB already has an entry for this experiment
          // Parse the file and save the content to the DB (upsert ? locally update / create the value of x, y1, y2 || appending function ?) in the experiment rain graph data
          const Jb = await readArrayFromFile(file);
          console.log(Jb);
        }
        if (fileName === 'J') {
          // Check if the DB already has an entry for this experiment
          // Parse the file and save the content to the DB (upsert ? locally update / create the value of x, y1, y2 || appending function ?) in the experiment rain graph data
          const J = await readArrayFromFile(file);
          console.log(J);
        }
        if (fileName === 'r') {
          // Check if the DB already has an entry for this experiment
          // Parse the file and save the content to the DB (upsert ? locally update / create the value of x, y1, y2 || appending function ?) in the experiment rain graph data
          const r = await readArrayFromFile(file);
          console.log(r);
        }
        if (fileName.startsWith('champs_assim')) {
          // Check if the DB already has an entry for this experiment
          // Save the path to the DB as rainMap
        }
        if (fileName === 'config.cfg') {
          // Check if the DB already has an entry for this experiment
          // Save the content to the DB parameters
        }
        if (fileName === 'diagnostics.png') {
          // Check if the DB already has an entry for this experiment
          // Save the path to the DB as costGraph
        }
        if (fileName.startsWith('inference')) {
          // Check if the DB already has an entry for this experiment
          // Save the path to the DB neuralNetworkLog
        }
        if (fileName === 'bash_assim.log') {
          // Check if the DB already has an entry for this experiment
          // Save the path to the DB assimilationLog
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

saveFilesToDB(mainPath);

module.exports = readArrayFromFile;
