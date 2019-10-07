'use strict'

var express = require('express');
var ProductController = require('../controllers/ProductController');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveProduct/:id', md_auth.ensureAuth, ProductController.saveProduct);

module.exports = api;