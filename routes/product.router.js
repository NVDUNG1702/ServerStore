const express = require('express')
const typeProductController = require('../controllers/type.controller')
const productController = require('../controllers/product.controller')
// const createProducts = require('../controllers/product.controller')
const productRouter = express.Router()


productRouter.post('/add', productController.createProducts);

productRouter.get('/getall', productController.getAllProduct)

productRouter.post('/addsize', productController.createSizeProduct)

productRouter.get('/getSizeProductById/:id', productController.getSizeProductByIdProduct)

productRouter.get('/getAllSize', productController.getAllSize)

productRouter.get('/getByID/:id', productController.getProductById);

productRouter.post('/checkFavorite', productController.checkFavoriteProduct)

productRouter.post('/addOrDeleteFavorite', productController.addOrRemoveFavorite)

productRouter.get('/favorite/:id', productController.getAllFavorite);

productRouter.delete('/deleteFavorite/:id', productController.deleteFavorite)

module.exports = productRouter 