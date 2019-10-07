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
            product.price = parseInt(Math.round(params.price * 100)/100).toFixed(2);
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
                        res.status(200).send({message: 'No se ha podido registrar el producto'});
                    }
                }
            });      
        }else{
            res.status(200).send({message: 'Introduce bien los datos'})
        }
    }   
}

function updateProduct(req, res){
    var productID = req.params.id;
    var updated = req.body;

    if(updated.price){
        updated.price = parseInt(Math.round(updated.price * 100)/100).toFixed(2);

        Product.findByIdAndUpdate(productID, updated, {new: true}, (err, productUpdated) => {
            if(err){
                res.status(200).send({message: 'Error al actualizar el producto'});
            }else{
                if(!productUpdated){
                    res.status(200).send({message: 'No se ha podido actualizar el producto'});
                }else{
                    res.status(200).send({product: productUpdated});
                }
            }
        });
    }else{
        Product.findByIdAndUpdate(productID, updated, {new: true}, (err, productUpdated) => {
            if(err){
                res.status(200).send({message: 'Error al actualizar el producto'});
            }else{
                if(!productUpdated){
                    res.status(200).send({message: 'No se ha podido actualizar el producto'});
                }else{
                    res.status(200).send({product: productUpdated});
                }
            }
        });
    }
}

function deleteProduct(req, res){
    var productID = req.params.id;
    var deleted = req.body;

    Product.findByIdAndRemove(productID, deleted, (err, productDeleted) => {
        if(err){
            res.status(200).send({message: 'Error al eliminar el producto'});
        }else{
            if(!productDeleted){
                res.status(200).send({message: 'No se ha podido eliminar el prodicto'});
            }else{
                res.status(200).send({message: '¡El producto: ' + productDeleted.name + ' fue eliminado satisfactoriamente!'})
            }
        }
    });
}

function listProducts(req, res){
    Product.find({}, (err, products) => {
        if(err){
            res.status(200).send(err);
        }else{
            res.status(200).send({products: products});
        }
    });
}

module.exports = {
    saveProduct,
    updateProduct,
    deleteProduct,
    listProducts
}