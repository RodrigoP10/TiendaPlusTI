'use strict'

var express = require('express');
var AdministratorController = require('../controllers/AdministratorController');
var md_auth = require('../middlewares/authenticated');
var multyparty = require('connect-multiparty');
var md_upload = multyparty({uploadDir: './uploads/admins'});

var api = express.Router();

api.post('/saveAdministrator', AdministratorController.saveAdministrator);
api.put('/updateAdministrator/:id', md_auth.ensureAuth, AdministratorController.updateAdministrator);
api.put('/deleteAdministrator/:id', md_auth.ensureAuth, AdministratorController.deleteAdministrator);
api.get('/listAdministrators', AdministratorController.listAdministrators);
api.post('/uploadImage/:id', [md_auth.ensureAuth, md_upload], AdministratorController.uploadImage);
api.get('/getImage/:ImageFile', AdministratorController.getImage);
api.post('/loginAdministrator', AdministratorController.login);

module.exports = api;