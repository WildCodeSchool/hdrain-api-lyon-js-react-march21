const router = require('express').Router();
const Exercise = require('../models/exercise.model');

router.route('/').get((req, res) => {
  Exercise.find()
    .then((exercices) => res.status(200).json(exercices))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
  const { username, description } = req.body;
  const { duration } = Number(req.body);
  const { date } = Date.parse(req.body);

  const newExercise = new Exercise({
    username,
    description,
    duration,
    date,
  });
  newExercise
    .save()
    .then(() => res.status(200).json('Exercise added!'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
