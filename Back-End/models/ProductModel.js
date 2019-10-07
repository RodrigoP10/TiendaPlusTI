'use strict'

var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var ProductSchema = Schema({
    name: String,
    description: String,
    stock: Number,
    category: String,
    price: {type: SchemaTypes.Decimal128},
    sold: Number
});

module.exports = mongoose.model("Product", ProductSchema);