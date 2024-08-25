

const express = require('express');
const cartController = require('../controllers/cart.controller');
const { veryfyAccessToken } = require('../helpers/jwt_service');

const cartRouter = express.Router();



cartRouter.post('/createCart', cartController.createCart);

cartRouter.post('/addOrUpdateDetailCart', cartController.addOrUpdateDetailCart);

cartRouter.get('/getCartByID/:id', cartController.getCartByID);

cartRouter.post('/pay', veryfyAccessToken, cartController.pay);

cartRouter.post('/getAll', veryfyAccessToken, cartController.getAll);

cartRouter.put('/cancelOrder', veryfyAccessToken, cartController.cancelOrder)

module.exports = { cartRouter }

