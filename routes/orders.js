const ordersRouter = require('express').Router();
const db = require('../db/queries');
const { v4: uuidv4 } = require("uuid");

module.exports = ordersRouter;


//CRUD operations include:
    //Create a new order -- this is initially done after "checkout" has completed
    //Read the details of an order
    //Update the details of an order -- i guess this would be after the order has been placed but before it is fulfilled it could be edited
    //Delete an order -- this would be when an order is cancelled and possibly when a user account is deleted? 



//TODO Create a new order
ordersRouter.post('/', (req, res) =>{

});

//TODO Read an order's information
ordersRouter.get('/', (req, res) =>{

});

//TODO Update an orders information
ordersRouter.put('/', (req, res) =>{

});

//TODO Delete an order
ordersRouter.delete('/', (req, res) =>{

});