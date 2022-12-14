import React, {useState, useEffect} from 'react';
import  Product  from './Product';


export default function(){
    
    const [products, setProducts] = useState([]);
    let tester = [];
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

//For some reason, when the fetch requets first goes out, the page tries to render regardless meaning it will try to call products.map before products has any info
//this calls an error 'you can't use .map on undefined'
//this method just makes it wait until there is data i think
    const renderDetermine = () =>{

        if(products[0] !== undefined){
            const returner = products.map((item) =>{
                return <Product product={item}></Product>});
            return returner;    
    }
}

console.log(products);


   
    return(
        <div className="store-front">
            <div className="search-bar">
              {/*Use this section for a search bar which will filter product items by name, and then a drop down menu to select different category tags */}  

            </div>
            <div className="product-tiles">
                {/* dynamically generate a list of products using useState*/}
                

            </div>
            <h1>Store Page</h1> 
            <div className='products-container'>{
                renderDetermine()
            }
            </div>
            
        </div>
    )
}