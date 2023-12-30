const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes.js');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path'); // Importa el módulo 'path' de Node.js
require('dotenv').config({ path: '../../.env' });
const { conn } = require('./db.js');

require('./db.js');

const server = express();

server.name = 'API';
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(morgan('dev'));

server.use(express.static(path.join(__dirname, 'public'))); 
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use('/', routes);

// Error catching endware.
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

const { env: { PORT } } = process;
server.listen(PORT || 3002, () => {
  console.log(`Server listening on port ${PORT ?? 3002}!`);
  conn.sync({ force: false });
});

module.exports = server;
