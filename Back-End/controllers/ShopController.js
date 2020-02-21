'use strict'

var Shop = require('../models/ShopModel');
var Product = require('../models/ProductModel');
var Bill = require('../models/BillModel');
var User = require('../models/UserModel');

function saveShop(req, res) {
    var shop = new Shop();
    var params = req.body;

    if (params.productCode && params.buyer && params.quantity) {
        Product.findOne({ productCode: params.productCode }, (err, productFound) => {
            if (err) {
                res.status(200).send({ message: 'Error, este producto no existe' });
            } else {
                if (productFound) {
                    shop.productCode = productFound.productCode;
                    shop.date = Date.now();

                    var buyer = params.buyer;
                    shop.buyer = buyer;
                    shop.quantity = params.quantity;
                    shop.subTotal = productFound.price * params.quantity;

                    if (params.quantity <= productFound.stock) {
                        productFound.stock -= params.quantity;
                        productFound.sold += shop.quantity;

                        productFound.save((err, productUpdated) => {
                            if (err) {
                                res.status(200).send({ message: 'Error al actualizar el producto' });
                            } else {
                                if (!productUpdated) {
                                    res.status(200).send({ message: 'No se ha podido actualizar el producto' });
                                } else {
                                    shop.save((err, shopStored) => {
                                        if (err) {
                                            res.status(200).send({ message: 'Error al guardar la compra' });
                                        } else {
                                            if (!shopStored) {
                                                res.status(200).send({ message: 'No se ha podido registrar la compra' });
                                            } else {
                                                var bill = new Bill();

                                                Bill.findOne({ buyer: buyer }, (err, buyerFound) => {
                                                    if(buyerFound){
                                                        buyerFound.products.push("Código del Producto: " + productFound.productCode + " - " + "Nombre del Producto: " + productFound.name);
                                                        buyerFound.total += shop.subTotal;

                                                        buyerFound.save((err, billUpdated) =>{
                                                            if(err){
                                                                res.status(200).send({ message: 'Error al guardar la factura' });
                                                            }else{
                                                                if(!billUpdated){
                                                                    res.status(200).send({ message: 'No se ha podido registrar la factura' });
                                                                }else{
                                                                    res.status(200).send({ shop: shopStored, productUpdated: productUpdated, billUpdated: billUpdated });
                                                                }
                                                            }                                                            
                                                        });
                                                    }else{
                                                        User.findOne({ _id: params.buyer} , (err, userFound) =>{

                                                            bill.buyer = buyer;
                                                            bill.user = "Usuario: " + userFound.user + " - Nombre: " + userFound.name + " " + userFound.surname;
                                                            bill.products = "Código del Producto: " + productFound.productCode + " - " + "Nombre del Producto: " + productFound.name;
                                                            bill.total = shop.subTotal;
    
                                                            bill.save((err, billSaved) =>{
                                                                if(err){
                                                                    res.status(200).send({ message: 'Error al guardar la factura' } + err);
                                                                }else{
                                                                    if(!billSaved){
                                                                        res.status(200).send({ message: 'No se ha podido registrar la factura' });
                                                                    }else{
                                                                        res.status(200).send({ shop: shopStored, productUpdated: productUpdated, bill: billSaved });
                                                                    }
                                                                }                                                            
                                                            });
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        res.status(200).send({ message: 'Esta cantidad supera a la del Inventario' });
                    }

                } else {
                    res.status(200).send({ message: 'Este producto no existe' });
                }
            }
        });
    } else {
        res.status(200).send({ message: 'Introduce bien los datos' });
    }
}

module.exports = {
    saveShop
}