const express = require('express');

let {
  verificarToken,
  verificaAdmin_Role
} = require('../middlewares/autenticacion');

const app = express();

let Categoria = require('../models/categoria');

// =============================
// Mostrar todas las categorias
// =============================
app.get('/categoria', verificarToken, function(req, res) {
  Categoria.find({})
    .populate('usuario', 'nombre email')
    .sort('descripcion')
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        categorias
      });
    });
});

// =============================
// Mostrar una categoria por ID
// =============================
app.get('/categoria/:id', verificarToken, function(req, res) {
  //Categoria.findById
  const id = req.params.id;
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'El id no es correcto'
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// =============================
// Crear nueva categoria
// =============================
app.post('/categoria', verificarToken, function(req, res) {
  //  regresa la nueva categoria
  //req.usuario._id
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categoriaDB
    });
  });
});

// =============================
// Actualizar una categoria por ID
// =============================
app.put('/categoria/:id', verificarToken, function(req, res) {
  let id = req.params.id;
  let body = req.body;
  let descCategoria = {
    descripcion: body.descripcion
  };
  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: false,
        categoria: categoriaDB
      });
    }
  );
});

// =============================
// Eliminar una categoria por ID
// =============================
app.delete('/categoria/:id', [verificarToken, verificaAdmin_Role], function(
  req,
  res
) {
  //Solo una ADMIN puede borrar categorias
  // Categoria.finByIdAndRemove
  let id = req.params.id;
  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'La categoria no existe'
        }
      });
    }
    res.json({
      ok: true,
      message: 'Categoria Borrada'
    });
  });
});

module.exports = app;
