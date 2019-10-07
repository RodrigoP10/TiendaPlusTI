'use strict'

var mongoose = require('mongoose');
var Administrator = require('./models/AdministratorModel');
var bcrypt = require('bcrypt-nodejs');

var app = require('./app');
var port = process.env.port || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/DBTiendaPlusTI2019', {useNewUrlParser: true, useFindAndModify: false})
.then((err, res) =>{
    console.log('Conexión a la base de datos realizada correctamente.');

    app.listen(port, () => {
        console.log('El servidor de Node y Express son válidos y están en ejecución.');
    });
})
.catch(err => console.log(err));

Administrator.findOne({ user: 'sa'}, (err, isSetAdmin) =>{
    if(err){
        console.log("Error, algo salió mal")
    }else{
        if(!isSetAdmin){
            var administrator = new Administrator();
            administrator.user = 'sa';
            administrator.password = '115CD5EAF7';
            administrator.role = 'ADMINISTRADOR';
            administrator.image = null;

            bcrypt.hash(administrator.password, null, null, function (err, hash) {
                administrator.password = hash;
            });

            administrator.save();

            console.log('El administrador por defecto ha sido creado correctamente');
        }      
    }
});
