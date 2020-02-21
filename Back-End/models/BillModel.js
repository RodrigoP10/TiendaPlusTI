'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BillSchema = ({
    buyer: [{ type: Schema.ObjectId, ref: 'Shop' }],
    user: [{ type: Schema.Types.String, ref: 'Shop' }],
    products: [{ type: Schema.Types.String, ref: 'Product'}],
    total: Number
});

module.exports = mongoose.model('Bill', BillSchema);