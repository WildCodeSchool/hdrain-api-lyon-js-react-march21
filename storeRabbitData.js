const { promises: fsp } = require('fs');
const { join } = require('path');
const ExperimentModel = require('./models/ExperimentModel');
const StatusModel = require('./models/StatusModel');
const SensorModel = require('./models/SensorModel');
const LocationModel = require('./models/LocationModel');

// -------------------HELPERS--------------------- //

// helper 1 : restructuring the data to made it suitable for the db
const cleanData = (data) => {
  // data to send in the database
  if (!data.Config) {
    return null;
  }

  const experimentData = {
    timestamp: data.date.replace(/h/, '_').split('_'),
    assimilationLog: data['LOG assim'],
    neuralNetworkLog: data['LOG RN'],
    parameters: data.Config,
    status: JSON.parse(data.Statuts),
    sensorsPosition: JSON.parse(JSON.parse(data.geometrie)),
    location: data.location ? data.location : 'Abidjan',
    locCoord: {
      lat: data.coordoonees ? data.coordoonees[0] : 'undefined',
      lng: data.coordoonees ? data.coordoonees[1] : 'undefined',
    },
    sendingDate: data['date envoi']
      ? data['date envoi'].replace(/-,:/g, '_').split('_')
      : 'undefined',
    rainMap: data['champs assim'] ? data['champs assim'] : 'undefined',
    costGraph: data.diagnostics ? data.diagnostics : 'undefined',
  };

  // change date fortmat
  experimentData.timestamp = new Date(
    experimentData.timestamp[0],
    experimentData.timestamp[1] - 1,
    experimentData.timestamp[2],
    experimentData.timestamp[3],
    experimentData.timestamp[4]
  );

  if (experimentData.sendingDate === 'undefined') return experimentData;

  experimentData.sendingDate = new Date(
    experimentData.sendingDate[0],
    experimentData.sendingDate[1] - 1,
    experimentData.sendingDate[2],
    experimentData.sendingDate[3],
    experimentData.sendingDate[4]
  );

  return experimentData;
};

// helper 2.1 : check if the experiment already exist in the db

// const checkDbForExperiment = async (experimentToCheck) => {

// };

// helper 2.2 : store image in server and get the path

const storeImgInServer = async (expData) => {
  if (expData.rainMap === 'undefined') return expData;

  const rainMapbase64 = expData.rainMap;
  const costGraphbase64 = expData.costGraph;

  const rainMapBufferData = Buffer.from(rainMapbase64, 'base64');
  const costGraphBufferData = Buffer.from(costGraphbase64, 'base64');

  // date format
  const expYear = expData.timestamp.getFullYear();
  const expMonth = expData.timestamp.getMonth();
  const expDay = expData.timestamp.getDate();
  const expHours = expData.timestamp.getHours();
  const expMinutes = expData.timestamp.getMinutes();

  const date = `${expYear}_${expMonth}_${expDay}_${expHours}h${expMinutes}`;

  const fileNameRainMap = `rainMap_${date}.png`;
  const fileNameCostGraph = `costGraph_${date}.png`;

  const rainMapPath = join('storage', 'images', fileNameRainMap);
  const costGraphPath = join(
    'storage',
    'images',
    fileNameCostGraph
  );

  // store rain map
  await fsp.writeFile(rainMapPath, rainMapBufferData);

  // store cost graph
  await fsp.writeFile(costGraphPath, costGraphBufferData);
  console.log('images stored');

  // re-assign path to the exp object
  const DataWithPath = expData;

  DataWithPath.rainMap = rainMapPath;
  DataWithPath.costGraph = costGraphPath;

  return DataWithPath;
};

// helper 3 store expriment
const saveExperiment = async (experiment) => {
  // check if the experiment already
  const experimentExists = await ExperimentModel.getExperiment(experiment);

  if (!experimentExists) {
    // store rainMap and cost graph
    const ExpWithImgPath = await storeImgInServer(experiment);

    // new experiment storing
    const storedExperiment = await ExperimentModel.create(ExpWithImgPath);

    console.log('experiment stored in DB: ', storedExperiment.id);

    ExpWithImgPath.experimentId = storedExperiment.id;

    return ExpWithImgPath;
  }
  return undefined;
};

// helper 4 : check if sensors exist in the db
const checkDbForSensors = async (experimentStoredData) => {
  const sensorsList = [];

  // get all the sensors from a location
  const idLoc = experimentStoredData.locationId.toString();

  const sensorsFromLocation = await SensorModel.findAllFromLocation(idLoc);

  // check if the sensors already exist in the db
  // make sure the sensor list is not empty
  if (!sensorsFromLocation.length) return sensorsList;

  // create an array of sensors
  const hdRainSensorNumber = Object.keys(experimentStoredData.sensorsPosition);

  hdRainSensorNumber.map((key) => {
    const sensorKey = parseInt(key, 10);

    const hdrSensorsInTheDb = sensorsFromLocation.find(
      (sensor) => sensor.sensorNumber === sensorKey
    );
    return sensorsList.push(hdrSensorsInTheDb);
  });

  const result = sensorsList.filter((sensor) => sensor !== undefined);

  return result;
};

// helper 5 : sensors storing
const sensorStoring = async (experimentAlreadyStored) => {
  const expStored = experimentAlreadyStored;

  const sensorsinDbCheck = await checkDbForSensors(expStored);

  // store the sensors if they are not already present
  if (sensorsinDbCheck.length !== 0) {
    return sensorsinDbCheck;
  }
  const storedSensors = await SensorModel.createSensors(
    expStored.sensorsPosition,
    expStored.locationId,
    expStored.timestamp
  );

  return storedSensors;
};

// helper 6 : store status
const storeStatus = async (listOfSensors, newExperimentData) => {
  const { status, experimentId } = newExperimentData;

  const statusToStore = listOfSensors.map((sensor) => ({
    code: status[sensor.sensorNumber],
    sensorId: sensor.id,
    experimentId,
  }));

  return StatusModel.createManyStatus(statusToStore);
};

// helper 7 : check location

const changeLocationId = async (arrayOfLocations, expSaved) => {
  const [expWithLocation] = arrayOfLocations.filter(
    (location) => location.name === expSaved.location
  );

  return { ...expSaved, locationId: expWithLocation.id };
};

const checkLocation = async (hdRainData) => {
  const locationInDb = await LocationModel.findMany();

  const changedExpLocId = await changeLocationId(locationInDb, hdRainData);

  return changedExpLocId;
};

// -------------------FUNCTION TO STORE ALL-------------------- //

const storeData = async (rabbitData) => {
  const hdRainDataToStore = await cleanData(rabbitData);

  if (!hdRainDataToStore) return console.log('wrong data');

  const experiementWithLocId = await checkLocation(hdRainDataToStore);

  const newExperimentInDb = await saveExperiment(experiementWithLocId);

  // no new experiment stored
  if (!newExperimentInDb) return console.log('The experiment already exists');

  const newSensorsList = await sensorStoring(newExperimentInDb);

  const newStatusStored = await storeStatus(newSensorsList, newExperimentInDb);

  console.log('New experiments stored in db :', newExperimentInDb.experimentId);

  return console.log('New status stored in db :', newStatusStored);

  // // store a status for each sensor in this location
};

// filter the data we need to store

module.exports = storeData;
