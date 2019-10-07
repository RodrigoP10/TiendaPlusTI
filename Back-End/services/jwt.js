'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_password';

exports.createToken = function(admin){
    var payload = {
        sub: admin._id,
        name: admin.name,
        surname: admin.surname,
        user: admin.user,
        role: admin.role,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }
    return jwt.encode(payload, secret);
}

exports.createTokenU = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        user: user.user,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }
    return jwt.encode(payload, secret);
}