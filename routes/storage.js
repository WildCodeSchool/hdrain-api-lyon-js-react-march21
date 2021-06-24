
const storageRouter = require('express').Router();
const path = require('path');
const multer = require('multer');
const ExperimentModel = require('../models/ExperimentModel');

const storage = multer.diskStorage({
  // Destination to store image
  destination: 'upload/images',
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}.${path.extname(file.originalname)}`
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const upload = multer({ storage });

storageRouter.get('/:id', async (req, res) => {
  try {
    const experimentId = req.params.id ;
    const filePath = await ExperimentModel.selectFile(experimentId);

    return res.status(200).send(filePath);
  } catch (error) {
    return res.status(500).send(error);
  }
});

storageRouter.post('/images', upload.single('image'), async (req, res) => {
  try {
    const id = 2;
    await ExperimentModel.update(id, req.file.path);
    return res.status(201).send(req.file);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = storageRouter;
