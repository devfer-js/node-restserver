//=======================
// Puerto
//=======================
process.env.PORT = process.env.PORT || 3000;

//=======================
// Entorno
//=======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================
// Vencimiento del token
//=======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=======================
// SEDD de autenticacion
//=======================

process.env.SEED = process.env.SEED || 'este-el-seed-desarrollo';

//=======================
// base de datos
//=======================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=======================
// Gooogle Client ID
//=======================
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  '1090526893252-0uq04f5hvu6spk054sjioguobc7dli52.apps.googleusercontent.com';
