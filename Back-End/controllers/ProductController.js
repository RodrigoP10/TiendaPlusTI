'use strict'

var Product = require('../models/ProductModel');

function saveProduct(req, res){
    var product = new Product();
    var adminID = req.params.id;
    var params = req.body;

    if(adminID != req.admin.sub || req.admin.role != 'ADMINISTRADOR'){
        res.status(200).send({ message: 'No tienes permisos para agregar un producto' });
    }else{
        if(params.name && params.description && params.stock && params.category && params.price){
            product.name = params.name;
            product.description = params.description;
            product.stock = params.stock;
            product.category = params.category;
            product.price = 'Q. ' + params.price;
            product.sold = 0;
    
            Product.findOne({name: product.name}, (err, isSetProduct) => {
                if(err){
                    res.status(200).send({message: 'Error, este producto ya existe'});
                }else{
                    if(!isSetProduct){
                           product.save((err, productStored) =>{ 
                            if(err){
                                res.status(200).send({message: 'Error al guardar el producto'});
                            }else{
                                if(!productStored){
                                    res.status(200).send({message: 'No se ha podido registrar el producto'});
                                }else{
                                    res.status(200).send({product: productStored});
                                }
                            }
                        });
                    }else{
                        res.status(200).send({message: 'No se ha podido registrar el usuario'});
                    }
                }
            });      
        }else{
            res.status(200).send({message: 'Introduce bien los datos'})
        }
    }   
}

module.exports = {
    saveProduct
}