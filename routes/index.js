var express = require('express');
const userRouter = require('./users.router');
const adminRouter = require('./admin.router');
const productRouter = require('./product.router');
const typeRouter = require('./type.router');
const { cartRouter } = require('./cart.router');
const deliveryInfoRouter = require('./deliveryinfo.router');

var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/admin', adminRouter);

router.use('/users', userRouter);

router.use('/product', productRouter)

router.use('/type_product', typeRouter)

router.use('/cart', cartRouter)

router.use('/infoNH', deliveryInfoRouter)

module.exports = router;