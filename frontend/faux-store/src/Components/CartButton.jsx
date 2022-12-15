import React, {useState} from 'react';

export default function CartButton({item, addToCartHandler }) {
    const [itemCount, setItemCount] = useState(0);
    const [generate, setGenerate] = React.useState(false);

    return(
        <div className="cart-button" tabIndex={0}>
            <span className="cart-button-container">
                <span className="product-info">
                    { generate ? <form className="item-count-input">
                                    <input name="count" type="number" required onChange={(e)=> setItemCount(e.target.value)}/>
                                    <button name="add-to-cart" onClick={addToCartHandler(item, itemCount)}>Add {itemCount} to cart</button>
                                </form> : 
                                <button className="add-to-cart" onClick={()=>setGenerate(true)}>Add to cart</button>}
                </span>
            </span>
        </div>
    );    
}