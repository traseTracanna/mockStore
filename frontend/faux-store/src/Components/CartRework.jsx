import React, {useState, useEffect} from 'react';


export default function CartRework({userId, addItemToCart}){

    const [cart, setCart] = useState({cartId: undefined, items: undefined, totalPrice: 0});


    //This variable will act as a workaround to not call populateCart if the cart is new
    let newCart;

    //Check if the given user has an active cart, initiating the generation of the Cart component
    useEffect(()=>{
        checkActiveCart(userId);
    }, []);

    //Call populateCart when the cardId is first set
    useEffect(()=>{
        if(!newCart && cart.cartId !== undefined){
        fetchCartData(cart.cartId);
        }
    }, [cart.cartId]);

    //Call addItem when the itemToAdd state of Store.jsx is updated
    useEffect(()=>{
        if(addItemToCart.item){
            addToCart(addItemToCart.item, addItemToCart.itemCount);
        }
    }, [addItemToCart]);


    /* Checks to see if the current user has an active cart
    ** If so, it will update the cart.cartId state with the active card Id, triggering populateCart
    ** If not, it will call generateNewCart
    */
    const checkActiveCart = async(userId) =>{
        try{

            let res = await fetch(`http://localhost:3001/cart/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            },
        });

            const resJson = await res.json();
            if(resJson.cartId === null){
                newCart = true;
                generateNewCart(userId);
            } else{
                newCart = false;
                setCart((prevCart) => { return { ...prevCart, cartId: resJson.cartId}});
            }

        } catch (err){
            console.log(err);
        }
        
    }

    
    //This will start a new cart instance for the user if they do not already have one active.
    const generateNewCart = async (userId) =>{

        try {
                
            let newCartFetcher = await fetch('http://localhost:3001/cart', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    id: userId
                }),
            });

            const newCart = newCartFetcher.json();
            setCart((prevCart) => { return {...prevCart, cartId: newCart.cartId}});

        } catch (err) {
            console.log(err);
        }

    }

    //breaking up the population of a cart with the data fetching as await .json() is causing some weird interactions
    const fetchCartData = async(cartId) =>{


        if(cart.items === undefined){

            try{

                let res = await fetch(`http://localhost:3001/cart/${cartId}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                },
            });

            //This response from the server/db contains an array of objects with the columns from the carts db table
            const cartItemsArray = await res.json();
            populateCart(cartItemsArray);

            } catch (err){
                console.log(err);
            }
        } else{
            console.log('Cart tried to populate, but already has items');
        }

    }



    //populates a reloaded cart with all of it's items from the data base and the total price
    const populateCart = (cartData) =>{
        const cartItemsArray = cartData;
        console.log(cartItemsArray);

        const loadCartTotalPrice = cartItemsArray.map((item) =>{
            return item.total_price;
        });

        const calcCartTotalPrice = loadCartTotalPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

        //Sets the cart to be it's previous id, the items value to be the array of rows fetched from the db, and the totalPrice to the reduction of an array of all the returned
        //row's total price's.
        setCart(prevCart =>{return {...prevCart, items: cartItemsArray, totalPrice: calcCartTotalPrice}});

        console.log('cart populated successfully?')

    }

    //adds an item to the existing cart state
    //will also add the item to the corresponding cart in the DB for later fetching
    //This will be called from a helper function in Store.jsx
    //The {item} will be the json data as it is displayed in the store page, and the {itemCount} will be a number from CartButton.jsx
    //So the parameters of the item will function the same as how they are defined in Product.jsx

    //carts.pg is expecting: user_id, product_id, product_amount, total_price, and cart_instance_id
    //userId and cartInstanceId can both be grabbed from the state
    //product_id is set as "number" so that will be item.id i think?
    //product_amount === itemCount
    //total_price === itemCount * item.price

    //it would make sense that when an item gets added the cart's items array, that it's in the same format as the items fetched from the db
    //Then again, maybe it doesn't actually matter depending on how i will display the cart? I might need to create some sort of function to better do so
    //I think part of the issue is that the way i have products stored in the database is different then how they are generated here on the front end

    //Okay i guess it's not quite true. The mis-match is how products stored in the Carts table is different than how they are stored in the Products table
    //Either way, i guess maybe a helper function to display the cart information to the user would condense all product amounts of the same product by their Id
    //and display their name by comparing their id in the cart to the id of the item in the Products table. It just seems like a messy db transaction that isn't necessary,
    //tho again, maybe i just need to worry about functionality and not quality of code work at this point.


    //Using this breaks the cart's items array for some reason
    const addToCart = async (item, itemCount) =>{
        const addedPrice = item.price * itemCount;




        //store new item in cart db to be pulled later for order generation/cart re-creation
        //Also adds the stored item into the current cart's items property array -- may need functionality if this is the first item being added to the cart, as items is initially
        //declared as 'undefined'
        try{
            let res = await fetch(`http://localhost:3001/cart/${cart.cartId}`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    productId: item.id, 
                    productAmount: itemCount, 
                    cartInstanceId: cart.cartId, 
                    totalPrice: addedPrice,
                    userId: userId,

                }),
            });

            const resJson = await res.json();
            console.log(resJson.message);
            const newItemsList = cart.items;
            newItemsList.push(resJson.itemInfo);

            setCart((prevCart) =>{ return {...prevCart, items: newItemsList, totalPrice: cart.totalPrice + addedPrice}});
        } catch (err){
            alert(err);
            console.log(err);

        }

        console.log(cart.items);

    };


//Unique Ids and Total are both displaying correctly

    return(
        <div className="cart-bar">
            <p className='item-count'>Unique item Ids in cart: {cart.items === undefined ? 0 : cart.items.length}</p>
            <span className='total-price'>Total: ${cart.totalPrice}  </span>

        </div>
    )
};
