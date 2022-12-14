import React from 'react';

export default function Product({ product, children }) {
    return(
        <div key={product.id} className="product" tabIndex={0}>
            <span className="product-container">
                <span className="product-info">
                    <ul>
                    <li className="product-info">name: {product.name}</li>
                    <li className="product-info">description: {product.description}</li>
                    <li className="product-info">price: {product.price}</li>
                    </ul>
                </span>

            </span>
            {children}
        </div>
    );    
}




    