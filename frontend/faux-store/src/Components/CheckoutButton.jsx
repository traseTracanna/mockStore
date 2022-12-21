import React from 'react';

/*The purpose of this component is to initiate the order sequence.
**By that i mean: saving the contents of the cart into the order_details table along with a generated order number
**assigning the order number to a user and storing that info in the orders table. 
**And finally deleting the info from the carts table. 
**I'm not sure if these functions will be written in here or if they're better off being written in the CartRework.jsx component, but maybe for organization
** in here would be preferable. 
*/ 

export default function CheckoutButton({itemsFromCart, cartId, userId, cartCleanup}){

    //Formats the items in the cart to be stored in the order_details table
    //The code in here is just copy/pasted from CartRework's displayHelper function, and if i were smart I would just figure out how to recycle that code instead of rewriting
    //Yeah idk if i were to refactor this code at all i think this would be a good first thing to do, because i'm literally just doing the same process twice in two spots
    const orderFormatter = (cartItems) => {
        const storageArray = [];

        //This for loop condenses all of the items from the cart into storageArray by combining identical items into 1 count.


        if (cartItems !== undefined) {
            for (let item of cartItems) {
                const itemInfo = { name: item.product_id, count: item.product_amount, price: item.total_price }


                if (storageArray.length === 0) {
                    storageArray.push(itemInfo);
                } else {
                    const itemToCombineIndex = storageArray.findIndex((arrayElement) => arrayElement.name === itemInfo.name);
                    if (itemToCombineIndex > 0) {
                        storageArray[itemToCombineIndex].count = storageArray[itemToCombineIndex].count + itemInfo.count;
                        storageArray[itemToCombineIndex].price = storageArray[itemToCombineIndex].price + itemInfo.price;
                    } else {
                        storageArray.push(itemInfo);
                    }
                }
            }

        }

        //So at this point storageArray is either empty becasue the person clicked "checkout" when the cart was empty
        //Maybe only allow 'checkout' to appear if the cart is not empty of items, but not worried about it right now
        //Or storage array is now ready to be stored into the order_details table by creating a transaction for each item in the storageArray array
        //So i think from here i should create a helper function to actually do the transaction just to keep things more neat?
        if (storageArray.length > 1) {
            orderPlacer(storageArray);
        }
    }

    //This function places the order by sending the formatted order array to the db to be iterated through, creating a new order in orders.pg in the process
    const orderPlacer = async (formattedOrder) => {

        //Send the formatted array, cart id, and user id to the db to store
        try {
            let res = await fetch(`http://localhost:3001/order/${userId}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    itemsArray: formattedOrder,
                    orderDetailsId: cartId,

                }),
            });
            
            //so maybe once i verify that this process worked successfully i can then call cartCleanup from the Store.jsx component to delete all of the cart
            //instance information that should be stored as an order by this.
            //Alternatively, in the orders.js POST /:id function, the cart cleanUp could just be initiated once the order generation process is finished, 
            //saving myself another server call
            const resJson = await res.json();
            console.log(`Response from attempt to store cart's data upon checkout: ${resJson}`);

        } catch (err) {
            console.log(err);
        }

    };

    return(
        <div className="checkout-button">
            <button name="checkout-button" className="checkout" onClick={() => orderFormatter(itemsFromCart)}>Checkout</button>
        </div>
    )
}