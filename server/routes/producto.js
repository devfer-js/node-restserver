const express = require('express');
const app = express();
const { verificarToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');

// =============================
// Obtener productos
// =============================
app.get('/productos', verificarToken, function(req, res) {
  // trae todos los productos
  //populate: usuario categoria
  //paginado
  let desde = req.query.desde || 0;
  desde = Number(desde);
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .sort('nombre')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        productos
      });
    });
});

// =============================
// Obtener producto por ID
// =============================
app.get('/productos/:id', verificarToken, function(req, res) {
  const id = req.params.id;
  Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre')
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El id no es correcto o no existe'
          }
        });
      }
      res.json({ ok: true, producto: productoDB });
    });
});

// =============================
// Buscar Productos
// =============================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
  const termino = req.params.termino;
  const regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex })
    .populate('categoria', 'nombre')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        productos
      });
    });
});

// =============================
// Crear un nuevo producto
// =============================
app.post('/productos', verificarToken, function(req, res) {
  //grabar el usuario
  // grabar una categoria del listado
  const { nombre, precioUni, descripcion, categoria } = req.body;
  const producto = new Producto({
    nombre,
    precioUni,
    descripcion,
    categoria,
    usuario: req.usuario._id
  });
  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      producto: productoDB
    });
  });
});

// =============================
// Actualizar un producto
// =============================
app.put('/productos/:id', verificarToken, function(req, res) {
  // editar una categoria del listado
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'El ID no existe'
        }
      });
    }

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;
    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado
      });
    });
  });
});

// =============================
// Borrar un producto
// =============================
app.delete('/productos/:id', verificarToken, function(req, res) {
  // disponible = falso
  const id = req.params.id;
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: { message: 'El id no existe' }
      });
    }

    productoDB.disponible = false;
    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        productoBorrado,
        message: 'Producto Borrado'
      });
    });
  });
});

module.exports = app;
