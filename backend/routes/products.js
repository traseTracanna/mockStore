const productsRouter = require('express').Router();
const db = require('../db/queries');

module.exports = productsRouter;


//Create a new product
productsRouter.post('/', (req, res) =>{
    const { name, description, price, category } = req.body;
    db.query('INSERT INTO products (name, description, price, category) VALUES ($1, $2, $3, $4)', [name, description, price, category], (err, result) =>{
        if(err){
            return res.status(400).send(err);
        }
        res.status(200).send(result.rows[0]);
    });

});

//should probably do this as req.params via id, category, or someother more specific aspect
//the one challenge i am facing most in this api development phase is not really understanding how the requests are sent. 
//LIke if i have a dropdown menu with a list of foods and click 'request info' or something, or even something more simple like a list of clickable foods
//that when clicked will display their information, how does that generate and send a request?

//Gets a single product by ID number
productsRouter.get('/:id', (req, res) =>{
    const id  = req.params.id;
    db.query('SELECT * FROM products WHERE id = $1;', [id], (err, result) =>{
        if(err){
            res.status(400).send(err);
        }
        if(result.rows.length === 0){
            return res.status(400).send('Product not found');
        }
        res.status(200).send(result.rows[0]);
    })
    

});

//Gets a list of all products in a specific category
//TODO Should update this to build the query based on if a category is specified, else: return all products in every category
productsRouter.get('/', (req,res) =>{
    const category = req.query.category;

    db.query('SELECT * FROM products WHERE category = $1;', [category], (err, result) =>{
        if (err) {
         return res.status(400).send(err);
        } else if(result.rows.length === 0){
            return res.status(400).send('Unknown Category');
        }
        res.status(200).send(result.rows);
        });

    });

//Update a product's information
//The req body of this will have to contain the updated information, and the unchanged information in order to work properly
productsRouter.put('/:id', (req, res) =>{
    const id = req.params.id;
    const { name, description, price, category } = req.body;
  

    db.query('UPDATE products SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING *;', 
             [name, description, price, category, id], (err, result) =>{
        if(err) {
            return res.status(400).send(err);
        } //This returns a count of all the possible rows it could've changed. I'm not sure if this is under the .rows paramter, or if it's one called .count; may have to change
        else if(result.rows.length === 0){
            return res.status(400).send('Unknown Product ID');
        }
        res.status(200).send(result.rows[0]);
    });

});

//Delete a product
productsRouter.delete('/:id', (req, res) =>{
    const id = req.params.id;

    db.query('DELETE FROM products WHERE id = $1', [id], (err, result) =>{
        if(err){
            return res.status(400).send(err);

        }
        else if(result.rowCount === 0){
            return res.status(400).send('Unknown Product ID');
        }
        res.status(200).send(`Removed ${result.rowCount} product(s)`);

    });

});