const express = require('express');
require('dotenv');
const Photo = require('../models/photo.js');
const uploadCloud = require('../config/cloudinary.js');
const router = express.Router();

//actual write to cloudinary via the middleware specified in ../config/cloudinary.js
router.post('/api/users/first-user/pictures', uploadCloud.single('photo'), (req, res, next) => {
  const imgName = req.file.originalname;
  const newPhoto = new Photo({imgName})
  console.log(req.file.url);

  //actual write in mongo using mongoose
  newPhoto.save()
  .then(photo => {
    res.json({url: req.file.url, photo: photo});
  })
  .catch(error => {
    console.log(error);
  })
});

module.exports = router;