const cartRouter = require('express').Router();
const db = require('../db/queries');
const { v4: uuidv4 } = require("uuid");

module.exports = cartRouter;

//CRUD operations include:
    //Create a new cart instance
    //Read the current contents of a cart
    //Update the products within a cart
    //Delete an instance of a cart -- this will be done when the "checkout" function is completed and a permanent order_details is created


//Create a new cart
cartRouter.post('/', (req, res) =>{
    const { id } = req.body;
    const newCartId = uuidv4();
    db.query('INSERT INTO carts (user_id, product_id, product_amount, total_price, cart_instance_id) VALUES ($1, 1000, 0, 0, $2) RETURNING *', [id, newCartId], (err, result)=>{
        if (err){
            return res.status(400).send(err);
        }
        res.status(200).send({cartId: result.rows[0].cart_instance_id, populateItem: result.rows});
    })

});

//Find a cart based on user ID
cartRouter.get('/user/:id', (req, res) =>{
    const userId = req.params.id;
    db.query('SELECT * FROM carts WHERE user_id = $1', [userId], (err, result)=>{
        if(err){
            return res.status(400).send(err);
        }
        if(result.rows.length === 0){
            return res.status(200).send({cartId: null, message: `No cart for user ${userId}`});
        }
        res.status(200).send({cartId: result.rows[0].cart_instance_id});
    })
});

//Read a cart's contents
cartRouter.get('/:id', (req, res) =>{
    const cartId = req.params.id;
    db.query('SELECT * FROM carts WHERE cart_instance_id = $1', [cartId], (err, result) =>{
        if(err){
            return res.status(400).send(err);
        } else if(result.rows.length === 0){
            return res.status(400).send('Unknown Cart Id');
        }
        res.status(200).send(result.rows);

    });

});

//Update a row's item count and total price
cartRouter.put('/:id', (req, res) =>{
    const cartId = req.params.id;
    const { productId, productAmount, totalPrice } = req.body;

    db.query('UPDATE carts SET product_amount = $1, total_price = $2 WHERE product_id = $3 AND cart_instance_id = $4' [productAmount, totalPrice, productId, cartId], (err, result)=>{
        if(err){
            return res.status(400).send(err);
        } else if(result.rows.length === 0){
            return res.status(400).send('Failed to update amount');
        }
        res.status(200).send(`Update completed. Review: ${result.rows[0]}`);
    });
});



//Add to a cart's contents
cartRouter.post('/:id', (req, res) =>{
    const cartId = req.params.id;
    const { productId, productAmount, userId, totalPrice, cartInstanceId } = req.body;
    //console.log(`productID: ${productId}, productAmount: ${productAmount}, userId: ${userId}, totalPrice: ${totalPrice}, cartInstanceId: ${cartInstanceId}`);

    db.query('INSERT INTO carts (user_id, product_id, product_amount, total_price, cart_instance_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [userId, productId, productAmount, totalPrice, cartInstanceId], (err, result) =>{
        if(err){
            return res.status(400).send(err);
        } else if (result.rowCount === 0){
            console.log(result);
            return res.status(400).send({message: 'Cart instance id not found'});
        }
        res.status(200).send({message: `${productAmount} ${productId}(s) have been added to user id #${userId}'s cart`, itemInfo: result.rows[0]});
    });

});

//Delete a cart instance
cartRouter.delete('/:id', (req, res) =>{
    const cartId = req.params.id;
    db.query('DELETE FROM carts WHERE cart_instance_id = $1', [cartId], (err, result) =>{
        if(err){
            return res.status(400).send(err);
        } else if(result.rowCount === 0){
            return res.status(400).send('Unknown Cart Instance id');
        }
        res.status(200).send(`${result.rowCount} cart instances have been removed from the database`);
    });
});

//TODO Create a function for 'checking out' which will create an order out of the instance of the cart used
cartRouter.post('/:id/checkout', (req, res) =>{
    const cartId = req.params.id;
    const orderDetailsId = uuidv4();
    const itemsForOrder = [];

    db.query('SELECT * FROM carts WHERE cart_instance_id = $1', [cartId], (err, result) =>{
        if(err){
            return res.status(400).send(err);
        } else if(result.rows.length === 0){
            return res.status(400).send('Cart id not found');
        }
        itemsForOrder = result.rows;
    });

    for(let item of itemsForOrder){
        db.query('INSERT INTO order_details (order_details_id, user_id, product, product_amount, total_price) VALUES ($1, $2, $3, $4, $5)', 
        [orderDetailsId, item.user_id, item.product, item.product_amount, item.total_price], (err, result) =>{
            if(err){
                return res.status(400).send(err);
            }
        });
    };
    res.status(200).send(`Order created under id number: ${orderDetailsId}`);

});