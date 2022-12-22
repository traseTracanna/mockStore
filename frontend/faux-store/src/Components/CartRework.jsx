import React, {useState, useEffect} from 'react';
import CheckoutButton from './CheckoutButton';

//TODO add a checkout feature to generate an order
//TODO add display functionality to see all the items in the cart


export default function CartRework({userId, addItemToCart, clearItemFromCart}){

    const [cart, setCart] = useState({cartId: undefined, items: undefined, totalPrice: 0});


    //Check if the given user has an active cart, initiating the generation of the Cart component
    useEffect(()=>{
        checkActiveCart(userId);
    }, []);

    //Call populateCart when the cartId is first set
    useEffect(()=>{
        if(cart.cartId !== undefined && cart.items === undefined){
        fetchCartData(cart.cartId);
        }
    }, [cart.cartId]);

    //Call addItem when the itemToAdd state of Store.jsx is updated
    console.log(cart.cartId);
    useEffect(()=>{
        if(addItemToCart.item && cart.cartId !== undefined){
            addToCart(addItemToCart.item, addItemToCart.itemCount);
        }
    }, [addItemToCart, cart.cartId]);

    //tries to display items in a cart
    useEffect(() =>{
        cartItemDisplayHelper();

    }, [cart.items])


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
                generateNewCart(userId);
            } else{
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

            const newCart = await newCartFetcher.json();
            const updateCartId = newCart.cartId;
            setCart((prevCart) => { return {...prevCart, cartId: updateCartId}});
            populateCart(newCart.populateItem);

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

        console.log('cart populated successfully?');

    }

    //adds an item to the existing cart state
    //will also add the item to the corresponding cart in the DB for later fetching
    //This will be called from a helper function in Store.jsx

    //carts.pg is expecting: user_id, product_id, product_amount, total_price, and cart_instance_id

    //i guess maybe a helper function to display the cart information to the user would condense all product amounts of the same product by their Id
    //and display their name by comparing their id in the cart to the id of the item in the Products table. It just seems like a messy db transaction that isn't necessary,
    //tho again, maybe i just need to worry about functionality and not quality of code work at this point.
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
            let newItemsList = [];
            if(cart.items !== undefined){
                newItemsList = cart.items;
            }
            
            newItemsList.push(resJson.itemInfo);
            console.log(newItemsList);

            setCart((prevCart) =>{ return {...prevCart, items: newItemsList, totalPrice: cart.totalPrice + addedPrice}});
        } catch (err){
            alert(err);
            console.log(err);

        }

        console.log(cart.items);
        clearItemFromCart();

    };

    //iterates through the items in cart.items and adds them to an array @displayArray
    //items are reduced in @displayArray based on item name, with their count updated appropriately
    //if the item type is not found in displayArray, the item type and it's count is pushed as an object onto the array
    //@return: displayArray.map to JSX compoonents that display the name, total count, and total price of that type of item
    //consider making this its own component file ala Product.jsx or CartButton.jsx
    const cartItemDisplayHelper = () =>{

        const displayArray = [];

        //This for loop condenses all of the items from the cart into displayArray by combining identical items into 1 count.
        //This relies on the items in cart.items to have a .name property, but i'm not sure that they do, might need to use .id instead
        //In the same vein as the above comment, i'm using '.itemCount' as the item count property, but this might be named incorrectly

        //this seems to work fine, and i think i fixed the price logic, but it needs to be tested
        
        if(cart.items !== undefined){
        for(let item of cart.items){
            const itemInfo = {name: item.product_id, count: item.product_amount, price: item.total_price}
            

            if(displayArray.length === 0){
                displayArray.push(itemInfo);
            } else {
                const itemToCombineIndex = displayArray.findIndex((arrayElement) => arrayElement.name === itemInfo.name);
                if(itemToCombineIndex > 0){
                    displayArray[itemToCombineIndex].count = displayArray[itemToCombineIndex].count + itemInfo.count;
                    displayArray[itemToCombineIndex].price = displayArray[itemToCombineIndex].price + itemInfo.price;
                } else{
                    displayArray.push(itemInfo);
                }
            }
        }
        

        return displayArray.map((item) => <li>Item name: {item.name}, Item count: {item.count}, Item price: {item.count * item.price}</li>)
    }

    }

    //This is called when the 'checkout' process is started
    //This clears the current cart's data from the db after it is stored in the order_details table
    //Might be able to bypass this by just having the initial server call that saves the cart info into an order do this once that info is properly saved
    //negating the need for this function.
    const clearCart = () =>{
        setCart(() =>{return {items: undefined, cartId: undefined, totalPrice: 0}});
        cartItemDisplayHelper();
        generateNewCart(userId);

    };


//Unique Ids and Total are both displaying correctly

    return(
        <div className="cart-bar">
            <p className='item-count'>Unique item Ids in cart: {cart.items === undefined ? 0 : cart.items.length}</p>
            <p className='total-price'>Total: ${cart.totalPrice}</p>
            <ul className='item-list'>{cartItemDisplayHelper()}</ul>
            <CheckoutButton itemsFromCart={cart.items} cartId={cart.cartId} userId={userId} cartCleanup={clearCart}/>

        </div>
    )
};
