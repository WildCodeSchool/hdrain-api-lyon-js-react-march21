/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const uploadRouter = require('express').Router();
const path = require('path');
const multer = require('multer');
const ExperimentModel = require('../models/ExperimentModel');


const storage = multer.diskStorage({
  // Destination to store image
  destination: 'upload/images',
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname  }_${  Date.now()  }${path.extname(file.originalname)}`
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const upload = multer({ storage });

uploadRouter.get('/', async (req, res) => {
  try {
    const id = 2;
    const imagePath = await ExperimentModel.selectImg(id);

    return res.status(200).send(imagePath);
  } catch (error) {
    return res.status(500).send(error);
  }
});

uploadRouter.post(
  '/images',
  upload.single('image'),
  async (req, res) => {
    const id = 2;
    await ExperimentModel.update(id, req.file.path);
    res.status(200).send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = uploadRouter;
