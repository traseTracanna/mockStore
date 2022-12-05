const userRouter = require('express').Router();

module.exports = userRouter;


//The CRUD operations we need to make in this section include: 
    //Creating a new user, 
    //Reading the user's information (UserID, Username, Email, Password, and Orders currently)
    //Updating the user's information which I think would just be their personal information as orders will be maintained seperately (see database diagram)
    //Deleting the user

//Get user's basic information, AND a list of their orders
userRouter.get('/:id', (req, res) =>{

});

//Create a new user
userRouter.post('/register', (req,res) =>{

});

//Perform a user login
userRouter.post('/login/:id', (req,res) =>{

});

//Delete a user (not sure how this would work, would it also delete the history of all their orders from the database? seems incorrect)
userRouter.delete('/:id', (req,res) =>{

});

//Update a user's information
userRouter.put('/:id', (req,res) =>{

});