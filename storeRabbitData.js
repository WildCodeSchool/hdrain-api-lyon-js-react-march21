const ExperimentModel = require('./models/ExperimentModel');
// const StatusModel = require('./models/StatusModel');
const SensorModel = require('./models/SensorModel');
// const LocationModel = require('./models/LocationModel');

// helper 1 : resutruring the data to made it suitable for the db
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
    experimentData.timestamp[4]
  );

  // show results
  return experimentData;
};

// helper 2 : check of the experiment already exist in the db
const checkDbForExperiment = async (experiment) => {
  const checkExperimentOnDb = await ExperimentModel.experimentAlreadyExists(
    experiment
  );
  return checkExperimentOnDb;
};

// helper 3 store expriment 
const exprimentStoring = async (dataToStore) => {
// add missing element
const store = dataToStore;

store.rainGraph = '/path';
store.costGraph = '/path';

// set all elements to that need to be stored in the database
const {
  timestamp,
  neuralNetworkLog,
  assimilationLog,
  rainGraph,
  costGraph,
  parameters,
  locationId,
} = store;

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

return store;
};

// helper 4 : check if sensors exist in the db 
const checkDbForSensors = async (experimentData) => {
    const sensorsList = [];

// get all the sensors from a location
const idLoc = experimentData.locationId.toString();
const sensorsFromLocation = await SensorModel.findAllFromLocation(idLoc);


// check if the sensors already exist in the db
  // make sure the sensor list is not empty
  if (sensorsFromLocation.length === 0) {
    console.log('Sensors list is empty in the db ', sensorsFromLocation);
    return sensorsFromLocation;
  }

  // create an array of sensors
  const hdRainSensor = Object.entries(experimentData.sensorsPosition);

hdRainSensor.forEach(entry => {
    const [key] = entry;
    const sensorKey = parseInt(key, 10);

    const hdrSensorsInTheDb = sensorsFromLocation.find(
      sensor => sensor.sensorNumber === sensorKey
    );

    return sensorsList.push(hdrSensorsInTheDb);
  });

//   console.log('we have sensors in the db: ', result.length);

  return sensorsList;
};

// helper 5 : sensors storing
const sensorStoring = async (experiment) => {

const sensorsinDb = await checkDbForSensors(experiment);

// store the sensors if they are not already present
if (sensorsinDb.includes(undefined)) {
    
 

  const storedSensors = await SensorModel.createSensor(
    experiment.sensorsPosition,
    experiment.locationId,
    experiment.timestamp
  );

  console.log('sensors stored in DB: ', storedSensors.length);
  return storedSensors
  }
  return console.log('sensors already store in the db: ');
};









// function to store all datas
const storeData = async (rabbitData) => {
  const hdRainDataToStore = await cleanData(rabbitData);

  // check if the experiment already
  const checkExperimentOnDb = await checkDbForExperiment(hdRainDataToStore);

  if (checkExperimentOnDb) {
    return console.log(
      'The experiment already exists, check experiment id : ',
      checkExperimentOnDb.id
    );
  } 

  const newExperimentInDb = await exprimentStoring(hdRainDataToStore);

const newSensorsList = await sensorStoring(newExperimentInDb);

return console.log(`New experiments stored in db :${  newExperimentInDb.id }, sensors stored: ${  newSensorsList.length }`)

   
    // // store a status for each sensor in this location
    // sensorsFromLocation.map(async (sensor) => {
    //   if (status[`${sensor.sensorNumber}`]) {
    //     const newStatus = {
    //       code: status[sensor.sensorNumber],
    //       sensorId: sensor.id,
    //       experimentId: StoredExperiment.id,
    //     };

    //     const storedStatus = await StatusModel.create(newStatus);

    //     console.log('status added', storedStatus);
    //   }
    // });
    // }
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
