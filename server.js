const express = require('express');

const server = express();


const receitasRoutes = require('./routes/receitas');

const usersRoutes = require('./routes/users');

const healthRoutes = require('./routes/health');

const logger = require('./middleware/logger');

server.use(express.json());

server.use(logger);

server.use(receitasRoutes.router);

server.use(healthRoutes.router);

server.use(usersRoutes.router);

module.exports = { server };