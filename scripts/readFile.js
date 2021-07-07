const fs = require('fs');
const util = require('util');
// const path = require('path');
const globCB = require('glob');
const ExperimentModel = require('../models/ExperimentModel');

// Convert `fs.readFile()` into a function that takes the
// same parameters but returns a promise.
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const glob = util.promisify(globCB);

// Path to scan
const mainPath = `${process.env.LOCAL_TARGET}/**/[0-9][0-9]h[0-9][0-9]`;

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

const getDateFromFileDirectory = (pathToFolder) => {
  const [directoryDate] = pathToFolder.match(/(\d{4})+.{12}/g);
  const splitDirectoryDate = directoryDate.split('/');
  const [hours, minutes] = splitDirectoryDate[3].split('h');
  const [years, months, days] = splitDirectoryDate;
  const date = new Date(years, months, days, hours, minutes);
  return date.toISOString();
};

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
    rainGraph: JSON.stringify({ y1, y2, x }),
    costGraph: `${folder}/diagnostics.png`,
    parameters: `${folder}/config.cfg`,
    locationId: 1,
  };
};

const isDirNotEmpty = async (folder) => {
  const dir = await readDir(folder);
  // console.log('inside : ', dir.length === 0);
  return dir.length !== 0;
};

const unprocessedFolders = async (folder, timestampsInDB) =>
  !(await timestampsInDB[getDateFromFileDirectory(folder)]);

const asyncFilter = async (folders, predicate) => {
  const boolTable = await Promise.all(folders.map(predicate));
  return folders.filter((_, index) => boolTable[index]);
};

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
