'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShopSchema = Schema({
    productCode: [{ type: Schema.Types.String, ref: 'Product' }],
    date: Date,
    buyer: [{ type: Schema.ObjectId, ref: 'User' }],
    quantity: Number,
    subTotal: Number
});

module.exports = mongoose.model('Shop', ShopSchema);