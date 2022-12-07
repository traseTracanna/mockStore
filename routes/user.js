const userRouter = require('express').Router();
const db = require('../db/queries');


module.exports = userRouter;


//The CRUD operations we need to make in this section include: 
    //Creating a new user, 
    //Reading the user's information (UserID, Username, Email, Password, and Orders currently)
    //Updating the user's information which I think would just be their personal information as orders will be maintained seperately (see database diagram)
    //Deleting the user

//Get user's basic information, AND a list of their orders
//Currently returns just their info from the DB
//TODO: call to the orders DB(i'm not sure if this is the best way to go about this) to get all of a specific user's orders
//Maybe i can hard code a request to the orders section of the api and async/await the results, but maybe that's needlessly overcomplicating things?
userRouter.get('/:id', (req, res) =>{
    const id = req.params.id;
    db.query('SELECT * FROM users WHERE id = $1', [id], (err, result) =>{
        if(err){
            return res.status(400).send(err);
        }
        res.status(200).send(result);
    })

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

//update a user's information
//this works in it's current form but still requires every column of the row to be submitted in the body.
//The commented code creates a statement I hoped would be able to modify only certain columns so the request body would only be the updated columns and not everything
//When trying different methods of implementing this statement however i kept getting syntax errors from SQL
userRouter.put('/:id', (req, res) =>{
    const id = req.params.id;
    const { username, email, password } = req.body;

   /* const updateFields = {
       'username': username,
       'email': email,
       'password': password,     
    };


    let queryParamConstructor = [];
    for(let property in updateFields){
        if(updateFields[property] !== undefined){
            queryParamConstructor.push(`${property} = ${updateFields[property]}`);

        };
    };
    const queryParamStatement = queryParamConstructor.join(', ');
*/
    db.query('UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *;', [username, email, password, id], (err, result)=>{
        console.log(err);
        if(err){
            return res.status(400).send(err);
        } else if (result.rows.length === 0){
            return res.status(400).send('User not found');
        }
        res.status(200).send(result.rows[0]);

    });
})

//Delete a user (not sure how this would work, would it also delete the history of all their orders from the database? seems incorrect)
userRouter.delete('/:id', (req,res) =>{
    const id = req.params.id;

    db.query('DELETE FROM users WHERE id = $1', [id], (err, result) =>{
        console.log(result);
        if(err){
            return res.status(400).send(err);
        } else if(result.rowCount === 0 ){
            return res.status(400).send('Delete failed: User not found');
        }
        res.status(200).send(`Removed ${result.rowCount} users`);

    });

});

