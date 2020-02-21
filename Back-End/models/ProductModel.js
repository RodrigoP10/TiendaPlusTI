'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
    productCode: String,
    name: String,
    description: String,
    stock: Number,
    category: String,
    price: Number,
    sold: Number
});

module.exports = mongoose.model('Product', ProductSchema);