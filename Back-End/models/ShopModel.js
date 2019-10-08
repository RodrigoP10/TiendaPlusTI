'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShopSchema = Schema({
    productCode: [{ type: Schema.ObjectId, ref: 'Product' }],
    date: Date,
    buyer: [{ type: Schema.ObjectId, ref: 'User' }],
    total: Number
});

module.exports = mongoose.model('Shop', ShopSchema);