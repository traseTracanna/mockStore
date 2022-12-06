const express = require('express');

//difference between app = express(); and router = express.Router(); ??
//app = express(); app seems to be the main director of routes in the root file, which tells requests to go to other files based on the requested route
//express.Router(); routers are then used in those specific files to go to their own endpoints.
const app = express();
const port = 3000;
const db = require('./db/queries');

const userRouter = require('./routes/user');

app.use(express.json());
app.use('/user', userRouter);


//GET Homepage
app.get('/', (req,res) =>{
    res.send("Server Default Tester")
});


app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});