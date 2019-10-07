'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = Schema({
    name: String,
    surname: String,
    user: String,
    password: String,
    role: String,
    image: String    
});

module.exports = mongoose.model('Admin', AdminSchema);