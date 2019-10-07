'use strict'

var express = require('express');
var ProductController = require('../controllers/ProductController');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveProduct/:id', md_auth.ensureAuth, ProductController.saveProduct);
api.put('/updateProduct/:id', md_auth.ensureAuth, ProductController.updateProduct);
api.put('/deleteProduct/:id', md_auth.ensureAuth, ProductController.deleteProduct);
api.get('/listProducts', md_auth.ensureAuth, ProductController.listProducts);

module.exports = api;