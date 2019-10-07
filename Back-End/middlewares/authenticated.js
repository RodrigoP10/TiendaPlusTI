'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_password';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(404).send({message: 'La petición de la cabecera no está autenticada'});
    }
    var token = req.headers.authorization.replace(/['"]+/g,'');
    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(404).send({message: 'El token ha expirado'});
        }
    }catch(exp){
        return res.status(404).send({message: 'El token no es válido'});
    }
    req.admin = payload;
    next();
}