const express = require('express');
require('dotenv');
const Movie = require('../models/movie.js');
const uploadCloud = require('../config/cloudinary.js');
const router = express.Router();

//we show all the images, in this case, movie images
router.get('/', (req, res, next) => {
  //we obtain all the movies from the mongodb and then we pass them to the view
  Movie.find()
  .then((movies) => {
    //passing movies to the index view
    res.render('index', { movies });
  })
  .catch((error) => {
    console.log(error);
  })
});

//here we render the image addition form
router.get('/movie/add', (req, res, next) => {
  console.log("xxx")
  res.render('movie-add');
});

//actual write to cloudinary via the middleware specified in ../config/cloudinary.js
router.post('/api/users/first-user/pictures', uploadCloud.single('photo'), (req, res, next) => {
  //write preparation, extracting the values send via the form
  // const { title, description } = req.body;
  // const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const newMovie = new Movie({imgName})

  //actual write in mongo using mongoose
  newMovie.save()
  .then(movie => {
    res.json({hola: true});
  })
  .catch(error => {
    console.log(error);
  })
});

module.exports = router;