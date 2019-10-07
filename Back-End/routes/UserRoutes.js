'use strict'

var express = require('express');
var UserController = require('../controllers/UserController');
var md_auth = require('../middlewares/authenticated');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './uploads/users'});

var api = express.Router();

api.post('/saveUser', UserController.saveUser);
api.post('/loginUser', UserController.login);
api.put('/updateUser/:id', md_auth.ensureAuth, UserController.updateUser);
api.put('/deleteUser/:id', md_auth.ensureAuth, UserController.deleteUser);
api.get('/listUsers', UserController.listUsers);
api.post('/uploadImageU/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/getImageU/:ImageFile', UserController.getImage);
 
module.exports = api;