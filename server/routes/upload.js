const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha seleccionado ningun archivo'
      }
    });
  }

  const tiposValidos = ['productos', 'usuarios'];
  if (tiposValidos.indexOf(tipo) < 0) {
    res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
      }
    });
  }

  let archivo = req.files.archivo;
  const nombreCortado = archivo.name.split('.');
  const extension = nombreCortado[nombreCortado.length - 1];

  // Extenciones permitidas
  const extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extencionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          'Las extenciones permitidas son ' + extencionesValidas.join(', '),
        extension
      }
    });
  }

  // =============================
  // Cambiar el nombre al archivo
  // =============================
  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err) {
      return res.status(500).json({ err, ok: false });
    }
    //Aqui la imagen ya se cargo
    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }
    // res.json({ ok: true, message: 'Imagen subida correctamente' });
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      });
    }

    borraArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err: {
          message: 'Producto no existe'
        }
      });
    }

    borraArchivo(productoDB.img, 'productos');

    productoDB.img = nombreArchivo;
    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        usuario: productoGuardado,
        img: nombreArchivo
      });
    });
  });
}

function borraArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
