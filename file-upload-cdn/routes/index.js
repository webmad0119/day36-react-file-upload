const express = require('express');
require('dotenv');
const Photo = require('../models/photo.js');
const User = require('../models/user.js');
const uploadCloud = require('../config/cloudinary.js');
const router = express.Router();

//este endpoint me devuelve la información del userId que solicitemos
//le pasamos el id del user que quiero en concreto via el :userId
//dentro del endpoint podemos recuperar que id nos pasaron usando req.params.userId
router.get('/api/users/:userId', (req, res) => {
  User.findById(req.params.userId)
  .then(user =>{
    res.json(user)
  })
})

//este endpoint permite que creemos un usuario nuevo via post
//para ello si lo deseas puedes usar postman
//tienes que pasar una clase username como por ejemplo {"username": "thilo"}
//de esta manera, este valor es recuperable dentro de este endpoint via req.body.username
router.post('/api/users/create', (req, res, next) => {
  User.create({
    username: req.body.username
  }).then(user => {
    //en este punto mongoose ya nos devuelve la info del usuario que acabas de crear
    res.json({usercreated: true, id: user._id, user: req.body.username})
  })
})

//aquí estamos actualizando el usuario, lo encontramos por id y recibimos un payload con el nuevo nombre de usuario
//este valor será el que quedará atribuido al usuario editado
router.put('/api/users/update', (req, res, next) => {
  User.findByIdAndUpdate("5c7524a58ca56f4edf5e52c9", {username: req.body.username}).then(user => {
    res.json({userUpdated: true, newUsername: req.body.username})
  })
})

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