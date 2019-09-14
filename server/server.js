require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configuracion Global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, err => {
  if (err) throw err;
  console.log('base de datos ONLINE');
});

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

app.listen(process.env.PORT, () => {
  console.log('Escuchando el puerto: ', process.env.PORT);
});
