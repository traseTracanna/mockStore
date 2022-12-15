import React, {useState, useEffect} from 'react';


export default function Cart({userId}){

    const [cart, setCart] = useState({id: 0, items:[], totalPrice: 0});

    //on login, check to see if there is an active cart still in the cart DB for this user ID, if not create a new one.
    //Store the returned cart ID in a variable to use for this 'instance'
    //This function will then set the state array that will be modified and rendered through adding/removing items
    useEffect(() =>{

        
        const generateCart = async (userId) =>{
            
            const temp = userId;
            
        try {
            let res = await fetch(`http://localhost:3001/cart/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                },
            });

            let resJson = await res.json();
            console.log(`resJson returned from res.json: ${resJson}`)
            console.log(`cartId returned from generateCart: ${resJson.cartId}`)
            if (resJson.cartId !== null) {
                setCart(cart, { id: resJson.cartId });
                populateCart(cart.id);
            } else {
                
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
                    setCart(cart, { id: newCart.cartId });
                } catch (err) {
                    //alert(err);
                    console.log(err);
                    }
            }
        } catch (err) {
            alert(err);
            console.log(err);
            }
        }
        generateCart(userId);

    }, []);


    //populates a reloaded cart with all of it's items from the data base and the total price
    const populateCart = async (cartId) =>{

        //call to db all items in carts table that match the given cart id
        //map through the returned object and push each element to the current cart's items
        //as you are pushing the items to the cart, pull each items price and add it together with item.total_price
        //at the end set the cart's total_price
        let priceReducer = 0;

        try{
            let res = await fetch(`http://localhost:3000/cart/${cartId}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                },
            });

            console.log(res);
            const resJson = await res.json();
            

            resJson.map((item) => (
                setCart({
                    ...cart, items: cart.items.push(item)
                }),
                priceReducer += item.total_price
            ));

            setCart({...cart, totalPrice: priceReducer})
        } catch (err){
            //alert(err);
            console.log(err);
        }

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
    const addToCart = async (item, itemCount) =>{
        const addedPrice = item.price * itemCount;

        //set state of cart to include the new item and total price
        setCart({
            ...cart,
            items: cart.items.push({item, count: itemCount}),
            totalPrice: cart.totalPrice + addedPrice,
        })

        //store new item in cart db to be pulled later for order generation/cart re-creation
        try{
            let res = await fetch(`localhost:3000/cart/${cart.id}`, {
                method: 'POST',
                header: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    productId: item.id, 
                    productAmount: itemCount, 
                    cartInstanceId: cart.id, 
                    totalPrice: addedPrice,
                    userId: userId,

                }),
            });

            const resJson = await res.json();
            console.log(resJson.message);
        } catch (err){
            alert(err);
            console.log(err);

        }


    };


    return(
        <div className="cart-bar">
            <p className='item-count'>Items in cart: {cart.items.length}</p>
            <span className='total-price'>Total: ${cart.totalPrice}</span>

        </div>
    )
};
