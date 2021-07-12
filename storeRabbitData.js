const ExperimentModel = require('./models/ExperimentModel');
const StatusModel = require('./models/StatusModel');
const SensorModel = require('./models/SensorModel');


// -------------------HELPERS--------------------- //


// helper 1 : restructuring the data to made it suitable for the db
const cleanData = (data) => {
  // data to send in the database
  if (!data.config) {
    throw new Error('Error: wrong data');
  }

  const experimentData = {
    timestamp: data.date.replace(/h/, '_').split('_'),
    assimilationLog: data['log assim'],
    neuralNetworkLog: data['log rn'],
    parameters: data.config,
    status: JSON.parse(data.statuts),
    locationId: data.location ? 1 : 1,
    sensorsPosition: JSON.parse(JSON.parse(data.geometrie)),
  };

  // change date fortmat
  experimentData.timestamp = new Date(
    experimentData.timestamp[0],
    experimentData.timestamp[1],
    experimentData.timestamp[2],
    experimentData.timestamp[3],
   ...experimentData.timestamp
  );

  return experimentData;
};

// helper 2 : check if the experiment already exist in the db
const checkDbForExperiment = async (experiment) => {
const checkDbForExperiment = async (experiment) => await ExperimentModel.experimentAlreadyExists(
    experiment
  );
  return checkExperimentOnDb;
};

// helper 3 store expriment
const saveExperiment = async (experiment) => {
  // check if the experiment already
  const experimentExists = await checkDbForExperiment(experiment);

  if (checkingExperiment) {
    return undefined;
  }

  // add missing element
  const data = dataToStore;

  data.rainGraph = '/path';
  data.costGraph = '/path';

  // set all elements to that need to be stored in the database
  const {
    timestamp,
    neuralNetworkLog,
    assimilationLog,
    rainGraph,
    costGraph,
    parameters,
    locationId,
  } = data;

  // new experiment storing
  const storedExperiment = await ExperimentModel.create({
    timestamp,
    neuralNetworkLog,
    assimilationLog,
    rainGraph,
    costGraph,
    parameters,
    locationId,
  });

  console.log('experiment stored in DB: ', storedExperiment.id);

  data.experimentId = storedExperiment.id;

  return data;
};

// helper 4 : check if sensors exist in the db
const checkDbForSensors = async (experimentStoredData) => {
  const sensorsList = [];

  // get all the sensors from a location
  const idLoc = experimentStoredData.locationId.toString();

  const sensorsFromLocation = await SensorModel.findAllFromLocation(idLoc);

  // check if the sensors already exist in the db
  // make sure the sensor list is not empty
  if (sensorsFromLocation.length === 0) {
    return sensorsList;
  }

  // create an array of sensors
  const hdRainSensorNumber = Object.keys(experimentStoredData.sensorsPosition);

  hdRainSensorNumber.map((key) => {
    const sensorKey = parseInt(key, 10);

    const hdrSensorsInTheDb = sensorsFromLocation.find(
      (sensor) => sensor.sensorNumber === sensorKey
    );
    return sensorsList.push(hdrSensorsInTheDb);
  });

  const result = sensorsList.filter((element) => element !== undefined);

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
  const storedSensors = await SensorModel.createSensor(
    expStored.sensorsPosition,
    expStored.locationId,
    expStored.timestamp
  );

  console.log(storedSensors.length);

  return storedSensors;
};

// helper 6 : store status
const statusStoring = async (listOfSensors, newExperimentData) => {
  const { status, experimentId } = newExperimentData;

  const statusToStore = listOfSensors.map((sensor) => {
    const newStatus = {
      code: status[sensor.sensorNumber],
      sensorId: sensor.id,
      experimentId,
    };

    return newStatus;
  });

  const storedStatus = await StatusModel.createManyStatus(statusToStore);

  return storedStatus;
};




// -------------------FUNCTION TO STORE ALL-------------------- //

const storeData = async (rabbitData) => {
  const hdRainDataToStore = await cleanData(rabbitData);

  const newExperimentInDb = await exprimentStoring(hdRainDataToStore);

  // no new experiment stored
  if (newExperimentInDb === undefined)
    return console.log('The experiment already exists');

  const newSensorsList = await sensorStoring(newExperimentInDb);

  const newStatusStored = await statusStoring(
    newSensorsList,
    newExperimentInDb
  );

  console.log('New experiments stored in db :', newExperimentInDb.experimentId);
  console.log('New status stored in db :', newStatusStored);

  return  console.log('Done !');
  // // store a status for each sensor in this location
};

// filter the data we need to store

module.exports = storeData;

// to use later

// check the location of the experiment
// const locationInDb = await LocationModel.findMany();

// const changeLocationId = (arrayOfLocations) => {
//   if (hdRainDataToStore.location === undefined) {
//     return false
//   }

//   const matchingLocation = arrayOfLocations.find(
//     (location) => location.name === hdRainDataToStore.location
//   );

//   return matchingLocation;
// };

// const goodLocation = changeLocationId(locationInDb);
