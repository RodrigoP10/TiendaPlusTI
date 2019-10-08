'use strict'

var Shop = require('../models/ShopModel');
var Product = require('../models/ProductModel');

function saveShop(req, res){
    var shop = new Shop();
    var params = req.body

    if(params.productCode){
        Product.findOne({productCode: params.productCode }, (err, productFound) => {
            if(err){
                res.status(200).send({message: 'Error, este producto no existe'});
            }else{
                if(!productFound){
                    shop.productCode = productFound.productCode;
                    shop.date = Date.now();
                    shop.buyer = params.buyer;
                    total = productFound.price;

                    shop.save((err, shopStored) => {
                        if(err){
                            res.status(200).send({ message: 'Error al guardar la compra' });
                        }else{
                            if(!shopStored){
                                res.status(200).send({ message: 'No se ha podido registrar la compra' });
                            }else{
                                res.status(200).send({ shop: shopStored });
                            }
                        }
                    });
                }
            }
        });
        

    }else{
        res.status(200).send({message: 'Introduce bien los datos'});
    }
}

module.exports = {
    saveShop
}