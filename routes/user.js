const userRouter = require('express').Router();
const db = require('../db/queries');


module.exports = userRouter;


//The CRUD operations we need to make in this section include: 
    //Creating a new user, 
    //Reading the user's information (UserID, Username, Email, Password, and Orders currently)
    //Updating the user's information which I think would just be their personal information as orders will be maintained seperately (see database diagram)
    //Deleting the user

//Get user's basic information, AND a list of their orders
userRouter.get('/', (req, res) =>{
    res.send('test');

});

//Create a new user
userRouter.post('/register', (req,res) =>{
    //const userName = req.params.userName;
    const { username, email, password } = req.body;
    db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password], (err, result) =>{
        if (err){
            res.send(err);
        }
        res.send('user registered!');
    });

});

//Perform a user login
userRouter.post('/login', (req,res) =>{
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = $1', [username], (err, user) => {
        if (err){
            return res.send(err);
        }
        if(user.rows.length === 0){
            return res.status(400).send('Wrong username or password');
        }

        if (user.rows[0].password === password){
            console.log('logged in successfully');
            res.send(user.rows[0]);
        } else{
            res.status(400).send('Wrong username or password');
        }
     })

});

//Delete a user (not sure how this would work, would it also delete the history of all their orders from the database? seems incorrect)
userRouter.delete('/:id', (req,res) =>{

});

//Update a user's information
userRouter.put('/:id', (req,res) =>{

});