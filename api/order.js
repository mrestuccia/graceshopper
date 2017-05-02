const app = require('express').Router();
const models = require('../models').models;



app.post('/:orderId', (req, res, next) => {
    models.OrderLine.findOne(
        {
            where: {
                orderId: req.params.orderId,
                productId: req.body.product.id
            }
        })
        .then(orderline => {
            if (orderline) {
                //Update the qty
                if(req.body.overwriteQty) {
                    orderline.qty = req.body.qty;
                } else {
                    orderline.qty += req.body.qty;
                }

                return orderline.save();
            } else {
                // Insert
                return models.OrderLine.create(
                    {
                        qty: req.body.qty,
                        productId: req.body.product.id,
                        orderId: req.params.orderId
                    });
            }
        })
        .then((created) => {
            res.send(created);
        })
        .catch(next);
});

app.delete('/:orderId/:productId', (req, res, next) => {
    console.log('DELETE', req.params.orderId, req.params.productId);
    models.OrderLine.destroy({
        where:
        {
            productId: req.params.productId,
            orderId: req.params.orderId
        }
    })
        .then((num) => {
            console.log('deleted = ', num);
            res.sendStatus(200);
        })
        .catch(next);
});


app.get('/:orderId', (req, res, next) => {
    models.Order.findAll(
        {
            where: { id: req.params.orderId },
            include: [
                {
                    model: models.OrderLine,
                    include: [{ model: models.Product }]
                }
            ]
        })
        .then(order => {
            res.send(order);
        })
        .catch(next);
});






module.exports = app;
