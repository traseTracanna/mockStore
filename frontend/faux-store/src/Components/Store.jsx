import React, {useState, useEffect, useCallback } from 'react';
import  Product  from './Product';
import CartButton from './CartButton';
import Cart from './Cart';
import CartRework from './CartRework';


export default function(){
    
    const [products, setProducts] = useState([]);
    const [itemToAdd, setItemToAdd] = useState({item: undefined, itemCount: undefined});
    //make a method to get all of the items in the products db and save their info in variables to be displayed
    //populate a list of tiles of images that shows the name and price of the item
    //have a button below each tile to add an entered quantity into the cart
    //maybe onHover, display item description and category tag information

    useEffect(() => {
        async function fetchData(){
            try{
                let res = await fetch('http://localhost:3001/products', {
                    method: "GET",
                    headers: {
                        "Content-type": "appliction/json"
                    },
                });
                let resJson = await res.json();
                setProducts(resJson); 
                   
            } catch (err) {
                alert(err);
                console.log(err);
            };
        }
        fetchData();
        
    }, []);


    //I guess this will just call to the Cart.jsx class and update some array of items stored in there that will be a part of that component's returned render object?
    const onAddToCartHandler = (item, itemCount, e) =>{
        e.preventDefault();
        
        setItemToAdd({item: item, itemCount: itemCount})
        //setItemToAdd({item: undefined, itemCount: undefined})
        console.log(item, itemCount);
        

    };


//console.log(products);


   
    return(
        <div className="store-front">
            <div className="search-bar">
              {/*Use this section for a search bar which will filter product items by name, and then a drop down menu to select different category tags */}  

            </div>
            <div className="product-tiles">
                {/* dynamically generate a list of products using useState*/}
                

            </div>
            <h1>Store Page</h1> 
            <div className='products-container'>
                {products[0] !== undefined ? products.map((item) =>(
                <Product product={item}>
                    <CartButton item={item} addToCartHandler={(item, itemCount, e) =>{onAddToCartHandler(item, itemCount, e)}} />
                </Product>)): undefined}
            </div>
            <div className='cart-bar'>
            <CartRework userId={8} addItemToCart={itemToAdd}/>
                
            </div>
            
        </div>
    )
}