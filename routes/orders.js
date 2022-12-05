const ordersRouter = require('express').Router();

module.exports = ordersRouter;


//CRUD operations include:
    //Create a new order -- this is initially done after "checkout" has completed
    //Read the details of an order
    //Update the details of an order -- i guess this would be after the order has been placed but before it is fulfilled it could be edited
    //Delete an order -- this would be when an order is cancelled and possibly when a user account is deleted? 



//TODO Create a new order
productsRouter.post('/', (req, res) =>{

});

//TODO Read an order's information
productsRouter.get('/', (req, res) =>{

});

//TODO Update an orders information
productsRouter.put('/', (req, res) =>{

});

//TODO Delete an order
productsRouter.delete('/', (req, res) =>{

});