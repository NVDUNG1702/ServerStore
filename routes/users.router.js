var express = require('express');
const userController = require('../controllers/user.controller');
const { veryfyAccessToken } = require('../helpers/jwt_service');
const uploadImage = require('../middlewares/uploads/upload_img');
const { authenticate } = require('../middlewares/auth/authenticate');
var userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', function (req, res, next) {
  res.send('user');
});

userRouter.post('/register', userController.register);

userRouter.post('/login', userController.login);

userRouter.post('/senOTP', veryfyAccessToken, userController.senOTP)

userRouter.put('/update', veryfyAccessToken, userController.update);

userRouter.post('/forgot', userController.forgot);

userRouter.post('/updatePass');

userRouter.post('/uploadAvatar', veryfyAccessToken, uploadImage('avatars'), userController.uploadAvatar);

userRouter.post('/login_with_token', veryfyAccessToken, userController.loginWithToken);

userRouter.post('/refresh_token', userController.refreshToken);

userRouter.post('/logout');



module.exports = userRouter;
