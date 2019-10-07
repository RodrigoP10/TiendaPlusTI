'use strict'

var Administrator = require('../models/AdministratorModel');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt');

function saveAdministrator(req, res) {
    var administrator = new Administrator();
    var params = req.body;

    if (params.name && params.surname && params.user && params.password) {
        administrator.name = params.name;
        administrator.surname = params.surname;
        administrator.user = params.user;
        administrator.password = params.password;
        administrator.role = 'ADMINISTRADOR';
        administrator.image = null;

        Administrator.findOne({ user: administrator.user }, (err, isSetAdmin) => {
            if (err) {
                res.status(200).send({ message: 'Error, este administrador ya existe' });
            } else {
                if (!isSetAdmin) {
                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        administrator.password = hash;

                        administrator.save((err, adminStored) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al guardar el administrador' });
                            } else {
                                if (!adminStored) {
                                    res.status(404).send({ message: 'No se ha podido registrar el administrador' });
                                } else {
                                    res.status(200).send({ admin: adminStored });
                                }
                            }
                        });
                    });
                } else {
                    res.status(500).send({ message: 'El administrador no se ha podido registrar' });
                }
            }
        });
    } else {
        res.status(500).send({ message: 'Introduce bien los datos' });
    }
}

function updateAdministrator(req, res) {
    var adminID = req.params.id;
    var updated = req.body;

    if(updated.password){
        bcrypt.hash(updated.password, null, null, function (err, hash) {
            updated.password = hash;

            Administrator.findByIdAndUpdate(adminID, updated, { new: true }, (err, adminUpdated) => {
                if (err) {
                    res.status(200).send({ message: 'Error al actulizar el administrador' })
                } else {
                    if (!adminUpdated) {
                        res.status(200).send({ message: 'No se ha podido actualizar el administrador' })
                    } else {
                        res.status(200).send({ admin: adminUpdated });
                    }
                }
            });
        });
    }else{
        Administrator.findByIdAndUpdate(adminID, updated, { new: true }, (err, adminUpdated) => {
            if (err) {
                res.status(200).send({ message: 'Error al actulizar el administrador' })
            } else {
                if (!adminUpdated) {
                    res.status(200).send({ message: 'No se ha podido actualizar el administrador' })
                } else {
                    res.status(200).send({ admin: adminUpdated });
                }
            }
        });
    }
}

function deleteAdministrator(req, res) {
    var adminID = req.params.id;
    var deleted = req.body;

    Administrator.findByIdAndRemove(adminID, deleted, (err, adminDeleted) => {
        if (err) {
            res.status(200).send({ message: 'Error al eliminar el administrador' })
        } else {
            if (!adminDeleted) {
                res.status(200).send({ message: 'No se ha podido eliminar al administrador' })
            } else {
                res.status(200).send({ message: '¡El administrador: ' + adminDeleted.user + ' fue eliminado satisfactoriamente!' })
            }
        }
    });
}

function listAdministrators(req, res) {
    Administrator.find({}, (err, administrators) => {
        if (err) {
            res.status(200).send(err);
        } else {
            res.status(200).send({ admins: administrators })
        }
    });
}

function login(req, res) {
    var params = req.body;
    var user = params.user;
    var password = params.password;

    Administrator.findOne({ user: user }, (err, user) => {
        if (err) {
            res.status(200).send({ message: 'Error al iniciar sesión' });
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        if (params.getToken) {
                            res.status(200).send({ token: jwt.createToken(user) });
                        } else {
                            res.status(200).send({ user: user });
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

function uploadImage(req, res) {
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
            Administrator.findByIdAndUpdate(userID, { image: file_name }, { new: true }, (err, userUpdate) => {
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

function getImage(req, res) {
    var ImageFile = req.params.ImageFile;
    var path_file = './uploads/admins/' + ImageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'El archivo no existe' });
        }
    });
}

module.exports = {
    saveAdministrator,
    updateAdministrator,
    deleteAdministrator,
    listAdministrators,
    uploadImage,
    getImage,
    login
}