const ordersRouter = require('express').Router();
const db = require('../db/queries');
const { v4: uuidv4 } = require("uuid");

module.exports = ordersRouter;


//CRUD operations include:
    //Create a new order -- this is initially done after "checkout" has completed
    //Read the details of an order
    //Delete an order -- this would be when an order is cancelled and possibly when a user account is deleted? 



//Create a new order
ordersRouter.post('/', (req, res) =>{
    const {orderDetailsId, userId} = req.body;
    db.query('INSERT INTO orders (user_id, order_details_id) VALUES ($1, $2)',[userId, orderDetailsId], (err, result) =>{
        if(err){
            return res.status(400).send(err);
        }
        res.status(200).send('Order created successfully');

    })

});

//Read an order's information
ordersRouter.get('/:id', (req, res) =>{
    const orderId = req.params.id;
    db.query('SELECT * FROM order_details WHERE order_details_id = $1', [orderId], (err, result) =>{
        if(err){
            return res.status(400).send(err)
        } else if(result.rows.length === 0){
            return res.status(400).send(`Order with id ${orderId} not found.`);
        }
        res.status(200).send(result.rows);
    });
});

//Get all orders for one customer
ordersRouter.get('/', (req,res) =>{
    const customerId = req.body;
    const orderIds = []; //an array of order_detail_ids for a specific customer
    const orderDetails = {}; //an array of all order details for a specific customer fetched via order_ids

    //a query that fetches all order_ids for a specific user and puts them into the orderIds array
    db.query('SELECT * FROM orders WHERE user_id = $1', [customerId], (err, result)=>{
        if(err){
            return res.status(400).send(err);
        } else if(result.rows.length === 0){
            return res.status(400).send('No orders found for customer');
        }
        for(let order of result.rows){
            orderIds.push(order.order_details_id);
        }
    });

    //Loops through the orderIds array and queries for all items that were a part of that order, adding them to the orderDetails object where each param of the object is an order
    for(let orderIndex = 0; orderIndex < orderIds.length; orderIndex++){
        db.query('SELECT * FROM order_details WHERE order_details_id = $1', [orderIds[orderIndex]], (err, result) =>{
            if(err){
                return res.status(400).send(err);
            } else if(result.rows.length === 0){
                return res.status(400).send(`Unkown order id ${orderIds[itemIndex]}`);
            }
            orderDetails.orderIds[orderIndex] = result.rows;
        });
    };
    res.status(200).send(orderDetails);

});

//Delete an order
ordersRouter.delete('/:id', (req, res) =>{
    const orderId = req.params.id;

    db.query('DELETE * FROM orders WHERE order_details_id = $1', [orderId], (err, result)=>{
        if(err){
            return res.status(400).send(err);
        } else if (result.rowCount === 0){
            return res.status(400).send('Failed to delete order or order not found');
        }
        res.status(200).send('Deleted order successfully');
    });

});