'use strict'

var User = require('../models/UserModel');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt');

function saveUser(req, res){
    var user = new User();
    var params = req.body

    if(params.name && params.surname && params.user && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.user = params.user;
        user.password = params.password;
        user.role = 'USUARIO';
        user.image = null;

        User.findOne({ user: user.user}, (err, isSetUser) => {
            if(err){
                res.status(200).send({message: 'Error, este usuario ya existe'})
            }else{
                if(!isSetUser){
                    bcrypt.hash(params.password, null, null, function (err, hash){
                        user.password = hash;

                        user.save((err, userStored) => {
                            if(err){
                                res.status(200).send({message: 'Error al guardar el usuario'});
                            }else{
                                if(!userStored){
                                    res.status(200).send({message: 'No se ha podido registrar el usuario'})
                                }else{
                                    res.status(200).send({user: userStored});                                
                                }
                            }
                        });
                    });
                }else{
                    res.status(200).send({message: 'El usuario no puede registrarse'});
                }
            }
        });
    }
}

function login(req, res){
    var params = req.body;
    var user = params.user;
    var password = params.password;

    User.findOne({ user: user }, (err, user) => {
        if (err) {
            res.status(200).send({ message: 'Error al iniciar sesión' });
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        if (params.getToken) {
                            res.status(200).send({ token: jwt.createTokenU(user) });
                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(200).send({ message: 'El usuario no ha podido iniciar sesión correctamente' });
                    }
                });
            } else {
                res.status(200).send({ message: 'No se puede encontrar al usuario' });
            }
        }
    });
}

function updateUser(req, res){
    var userID = req.params.id;
    var updated = req.body;    

    if(updated.password){
        bcrypt.hash(updated.password, null, null, function (err, hash){
            updated.password = hash;

            User.findByIdAndUpdate(userID, updated, {new: true}, (err, userUpdated) => {
                if(err){
                    res.status(200).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!userUpdated){
                        res.status(200).send({message: 'No se ha podido actualizar el usuario'});
                    }else{                    
                        res.status(200).send({user: userUpdated});                                
                    }
                }
            });
        });
    }else{
        User.findByIdAndUpdate(userID, updated, {new: true}, (err, userUpdated) => {
            if(err){
                res.status(200).send({message: 'Error al actualizar el usuario'});
            }else{
                if(!userUpdated){
                    res.status(200).send({message: 'No se ha podido actualizar el usuario'});
                }else{                    
                    res.status(200).send({user: userUpdated});                                
                }
            }
        });
    }    
}

function deleteUser(req, res){
    var userID = req.params.id;
    var deleted = req.body;

    User.findByIdAndRemove(userID, deleted, (err, userDeleted) => {
        if(err){
            res.status(200).send({message: 'Error al eliminar el usuario'});
        }else{
            if(!userDeleted){
                res.status(200).send({message: 'No se ha podido eliminar el usuario'})
            }else{
                res.status(200).send({message: '¡El usuario: ' + userDeleted.user + ' fue eliminado satisfactoriamente!'})
            }
        }
    });
}

function listUsers(req, res){
    User.find({}, (err, users) =>{
        if(err){
            res.status(200).send({err});
        }else{
            res.status(200).send({users: users})
        }
    });
}

function uploadImage(req, res){
    var userID = req.params.id;
    var file_name = 'Archivo no subido';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_explit = file_name.split('\.');
        var file_ext = ext_explit[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpge' || file_ext == 'gif') {
            if (userID != req.admin.sub) {
                res.status(500).send({
                    message: 'No tiene permiso de subir esa imagen'
                });
            }
            User.findByIdAndUpdate(userID, { image: file_name }, { new: true }, (err, userUpdate) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar el usuario'
                    });
                } else {
                    if (!userUpdate) {
                        res.status(404).send({
                            message: 'No se ha podido actualizar el usuario'
                        });
                    } else {
                        res.status(200).send({
                            User: userUpdate, image: file_name
                        });
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({ message: 'Extensión no admitida' });
                } else {
                    res.status(200).send({ message: 'Extensión no admitida' });
                }
            });
        }
    } else {
        res.status(404).send({
            message: 'No se han subido archivos'
        });
    }
}

function getImage(req, res){
    var ImageFile = req.params.ImageFile;
    var path_file = './uploads/users/' + ImageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'El archivo no existe' });
        }
    });
}

module.exports = {
    saveUser,
    login,
    updateUser,
    deleteUser,
    listUsers,
    uploadImage,
    getImage
}