var express = require('express');
var router = express.Router();
const homeController = require('../app/controllers/HomeController');
const sharingController = require('../app/controllers/SharingController')
const checkLogin = require('../util/checkLogin');
const check = require('../util/check');
router.get('/',check, sharingController.index)
router.get('/register', homeController.register);
router.post('/register', homeController.handleRegister);
router.get('/login', homeController.login);
router.post('/login', homeController.handleLogin)
router.get('/changePass',checkLogin, homeController.changePass)
router.post('/changePass', checkLogin, homeController.handleChangePass)
router.get('/logout', checkLogin, homeController.logout)
module.exports = router;