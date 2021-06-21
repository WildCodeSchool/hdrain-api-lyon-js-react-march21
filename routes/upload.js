/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const uploadRouter = require('express').Router();
const path = require('path');

const multer = require('multer');

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

// filesRouter.get('/', async (req, res) => {
//   try {
//   } catch (error) {}
// });

uploadRouter.post(
  '/images',
  upload.single('images'),
  (req, res) => {
    res.status(200).send(req.files);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = uploadRouter;
