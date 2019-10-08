'use strict'

var ShopController = require('../controllers/ShopController');
var express = require('express');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveShop', md_auth.ensureAuth, ShopController.saveShop);

module.exports = api;