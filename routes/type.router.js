
const express = require('express');
const typeProductController = require('../controllers/type.controller');

const typeRouter = express.Router();


typeRouter.post('/create', typeProductController.create)

module.exports = typeRouter