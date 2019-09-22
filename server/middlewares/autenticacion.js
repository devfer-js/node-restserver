const jwt = require('jsonwebtoken');
// ===============
// verificar Token
// ===============

let verificarToken = (req, res, next) => {
  let token = req.get('token');
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no valido'
        }
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

// ===============
// verificar adminRole
// ===============
let verificaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario;
  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: 'No es ADMINISTRADOR'
      }
    });
  }
};

// ===============
// verificar Token para img
// ===============

let verificarTokenImg = (req, res, next) => {
  let token = req.query.token;
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no valido'
        }
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = {
  verificarToken,
  verificaAdmin_Role,
  verificarTokenImg
};
