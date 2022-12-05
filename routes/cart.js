const cartRouter = require('express').Router();

module.exports = cartRouter;

//CRUD operations include:
    //Create a new cart instance
    //Read the current contents of a cart
    //Update the products within a cart
    //Delete an instance of a cart -- this will be done when the "checkout" function is completed and a permanent order_details is created


//TODO Create a new cart
productsRouter.post('/', (req, res) =>{

});

//TODO Read a cart's contents
productsRouter.get('/', (req, res) =>{

});

//TODO Update a cart's contents
productsRouter.put('/', (req, res) =>{

});

//TODO Delete a cart instance
productsRouter.delete('/', (req, res) =>{

});