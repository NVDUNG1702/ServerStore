

const express = require('express');
const deliveryInfoController = require('../controllers/deliveryinfo.controller');
const { veryfyAccessToken } = require('../helpers/jwt_service');

const deliveryInfoRouter = express.Router();


deliveryInfoRouter.get('/getByUid/:id', veryfyAccessToken, deliveryInfoController.getByUid)

deliveryInfoRouter.post('/add',veryfyAccessToken, deliveryInfoController.add)

deliveryInfoRouter.post('/delete/:id', veryfyAccessToken, deliveryInfoController.delete)



module.exports = deliveryInfoRouter