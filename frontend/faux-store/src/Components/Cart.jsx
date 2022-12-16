import React, {useState, useEffect} from 'react';


export default function Cart({userId, itemToAdd}){

    const [cart, setCart] = useState({id: "0a", items:[], totalPrice: 0});

    //on login, check to see if there is an active cart still in the cart DB for this user ID, if not create a new one.
    //Store the returned cart ID in a variable to use for this 'instance'
    //This function will then set the state array that will be modified and rendered through adding/removing items
   
    

    const generateCart = async (userId) =>{

        
    try {
        let res = await fetch(`http://localhost:3001/cart/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            },
        });

        let resJson = await res.json();
        //console.log(`cartId returned from generateCart: ${resJson.cartId}`)
        if (resJson.cartId !== null) {
            setCart(prevState => {return {...prevState, id: resJson.cartId}});
            populateCart(resJson.cartId);
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

    useEffect(() =>{   
        generateCart(userId);
        console.log(cart.id);
        //populateCart(cart.id);
        if(itemToAdd.item !== undefined){
            addToCart(itemToAdd.item, itemToAdd.itemCount);
        }

    }, []);


    //populates a reloaded cart with all of it's items from the data base and the total price
    const populateCart = async (cartId) =>{

        //call to db all items in carts table that match the given cart id
        //map through the returned object and push each element to the current cart's items
        //as you are pushing the items to the cart, pull each items price and add it together with item.total_price
        //at the end set the cart's total_price
        let priceReducer = 0
        let items = [];
        

        try{
            let res = await fetch(`http://localhost:3001/cart/${cartId}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                },
            });

            
            const resJson = await res.json();
            items = resJson;
            
            

            
        } catch (err){
            //alert(err);
            console.log(err);
        }

        console.log(items);

        items.map((item) => (
            setCart({
                ...cart, items: cart.items.push(item)
            }),
            priceReducer = priceReducer + (item.total_price*item.product_amount),
            console.log(priceReducer)
        ));

        setCart({...cart, totalPrice: priceReducer})

        console.log(cart);

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
            let res = await fetch(`http://localhost:3001/cart/${cart.id}`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    productId: item.id, 
                    productAmount: itemCount, 
                    cartInstanceId: "ac5b37ca-12b2-4af1-84ef-9c74c59c10fc", 
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
            <p className='item-count'>Unique item Ids in cart: {cart.items.length}</p>
            <span className='total-price'>Total: ${cart.totalPrice}</span>

        </div>
    )
};
