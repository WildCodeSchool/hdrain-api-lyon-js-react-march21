const fs = require('fs');
const util = require('util');
const globCB = require('glob');
const ExperimentModel = require('../models/ExperimentModel');
const SensorModel = require('../models/SensorModel');
const StatusModel = require('../models/StatusModel');

// Convert `fs.readFile()` into a function that takes the
// same parameters but returns a promise.
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const glob = util.promisify(globCB);

// Function to read the file content en return it
const readDataFromFile = async (pathToFile) => {
  try {
    const buffer = await readFile(pathToFile);
    return buffer.toString('utf8');
  } catch (error) {
    return '';
  }
};

// Function returning a date to ISO standard from the path of a file/folder
const getDateFromFileDirectory = (pathToFolder) => {
  const [directoryDate] = pathToFolder.match(/(\d{4})+.{12}/g);
  const splitDirectoryDate = directoryDate.split('/');
  const [hours, minutes] = splitDirectoryDate[3].split('h');
  const [years, months, days] = splitDirectoryDate;
  // months start from 0 (january) in JS
  const date = new Date(years, months - 1, days, hours, minutes);
  return date.toISOString();
};

// Function returning wether a folder is empty or not
const isDirNotEmpty = async (folder) => {
  const dir = await readDir(folder);
  return dir.length !== 0;
};

// checks if a givent folder already exists in the database
const unprocessedFolders = async (folder, timestampsInDB) =>
  !(await timestampsInDB[getDateFromFileDirectory(folder)]);

// Function to filter an array asynchronously
const asyncFilter = async (items, predicate) => {
  const boolTable = await Promise.all(items.map(predicate));
  return items.filter((_, index) => boolTable[index]);
};

// Function to parse the sensors' list from the geometrie file
const parseSensorList = async (folder) =>
  JSON.parse(await readDataFromFile(`${folder}/geometrie.json`));

// Function to parse the sensors' satuts
const parseSensorStatus = async (folder) =>
  JSON.parse(await readDataFromFile(`${folder}/statut_stations.log`));

// Function to save one experiment, and its sensors and their status
const saveDataToDB = async (folder) => {
  // Save the experiment in the DB
  const experiment = await ExperimentModel.create({
    timestamp: getDateFromFileDirectory(folder),
    neuralNetworkLog: `${folder}/diagnostics.png`,
    assimilationLog: await readDataFromFile(`${folder}/bash_assim.log`),
    rainGraph: `${folder}/fig.png`,
    // need to check for the rain graph source file
    costGraph: `${folder}/diagnostics.png`,
    parameters: await readDataFromFile(`${folder}/config.cfg`),
    rainMap: `${folder}/champs_assim_t3.png`,
    locationId: 1,
  });
  // Frome the saved experiment, grab its ID (with locationId) and use them to save the list of sensors if not already present in the DB
  const experimentId = experiment.id;
  const sensors = await parseSensorList(folder);
  console.log({ sensors });
  // FIX-ME
  const sensorNumberList = Object.keys(sensors).map(Number);
  console.log({ sensorNumberList });
  const filteredSensorList = await asyncFilter(
    sensorNumberList,
    async (sensorNumber) => SensorModel.sensorDoesNotExist(1, sensorNumber)
  );
  console.log({ filteredSensorList });
  // Save the sensors in the DB
  Promise.all(
    filteredSensorList.map(async (number) =>
      SensorModel.create({
        experimentId,
        sensorNumber: number,
        spotName: sensors[number].lieux,
        lat: sensors[number].latitude,
        lng: sensors[number].longitude,
        createAt: experiment.timestamp,
      })
    )
  );
  // Get all sensors of an experiment from the DB
  const experimentSensorList = await SensorModel.findAllFromLocation(1);
  console.log({ experimentSensorList });
  const sensorsStatus = await parseSensorStatus(folder);
  // Save the status of the sensors in the DB
  experimentSensorList.map((sensor) => {
    const status = sensorsStatus[sensor.sensorNumber];
    return StatusModel.create({
      sensorId: sensor.id,
      experimentId,
      code: status,
    });
  });
};

// Main function to save of the files info to the DB
const main = async (pathToFiles) => {
  try {
    const folders = await glob(pathToFiles);
    const timestampsInDB = await ExperimentModel.getAllTimestamps();
    await Promise.all(
      (
        await asyncFilter(await asyncFilter(folders, isDirNotEmpty), (folder) =>
          unprocessedFolders(folder, timestampsInDB)
        )
      ).map(saveDataToDB)
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = main;
