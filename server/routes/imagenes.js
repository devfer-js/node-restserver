const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificarTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificarTokenImg, function(req, res) {
  const tipo = req.params.tipo;
  const img = req.params.img;
  const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const noImgPath = path.resolve(__dirname, '../assets/no-img.jpg');
    res.sendFile(noImgPath);
  }
});

module.exports = app;
