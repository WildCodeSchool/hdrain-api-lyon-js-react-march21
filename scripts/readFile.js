const fs = require('fs');
const util = require('util');
const globCB = require('glob');
const ExperimentModel = require('../models/ExperimentModel');

// Convert `fs.readFile()` into a function that takes the
// same parameters but returns a promise.
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const glob = util.promisify(globCB);

// Path to scan
const mainPath = `${process.env.LOCAL_TARGET}/**/[0-9][0-9]h[0-9][0-9]`;

// Function to read the files where the rain graph values are stored and returns an array
const readArrayFromFile = async (pathToFile) => {
  try {
    const buffer = await readFile(pathToFile);
    return buffer.toString('utf8').trim().split('\n').map(Number);
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Function returning an object of station's status
const readStationStatusFromFile = async (pathToFile) => {
  try {
    const buffer = await readFile(pathToFile);
    return JSON.parse(buffer);
  } catch (error) {
    console.error(error);
    return { error };
  }
};

// Function returning a date to ISO standard from the path of a file/folder
const getDateFromFileDirectory = (pathToFolder) => {
  const [directoryDate] = pathToFolder.match(/(\d{4})+.{12}/g);
  const splitDirectoryDate = directoryDate.split('/');
  const [hours, minutes] = splitDirectoryDate[3].split('h');
  const [years, months, days] = splitDirectoryDate;
  
  // months start from 0(january) in JS
  const date = new Date(years, months-1, days, hours, minutes);
  return date.toISOString();
};

// Function to create an object representing an experiment using the folder's content
const createExperiment = async (folder) => {
  const [y1, y2, x] = await Promise.all([
    readArrayFromFile(`${folder}/J`),
    readArrayFromFile(`${folder}/Jb`),
    readArrayFromFile(`${folder}/JNL`),
  ]);
  return {
    timestamp: getDateFromFileDirectory(folder),
    neuralNetworkLog: `${folder}/diagnostics.png`,
    assimilationLog: `${folder}/bash_assim.log`,
    costGraph: JSON.stringify({ y1, y2, x }),

    // need to check for the rain graph source file
    rainGraph: `${folder}/diagnostics.png`,
    parameters: `${folder}/config.cfg`,
    locationId: 1,
  };
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
const asyncFilter = async (folders, predicate) => {
  const boolTable = await Promise.all(folders.map(predicate));
  return folders.filter((_, index) => boolTable[index]);
};

// Main function to save of the files info to the DB
const saveFilesToDB = async (pathToFiles) => {
  try {
    const folders = await glob(pathToFiles);
    const timestampsInDB = await ExperimentModel.getAllTimestamps();
    const newExperiementsArray = await Promise.all(
      (
        await asyncFilter(await asyncFilter(folders, isDirNotEmpty), (folder) =>
          unprocessedFolders(folder, timestampsInDB)
        )
      ).map(createExperiment)
    );
    const createdExperiments = await ExperimentModel.createManyExperiments(
      newExperiementsArray
    );
    console.log(createdExperiments);
  } catch (error) {
    console.error(error);
  }
};

saveFilesToDB(mainPath);

module.exports = {
  readArrayFromFile,
  saveFilesToDB,
  getDateFromFileDirectory,
  readStationStatusFromFile,
  createExperiment,
};
