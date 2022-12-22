//This page will display user information such as username and email
//This page will display a list of order's tied to a user's id
//The orders will be expandable to display their detailed information

import React, { useState, useEffect } from 'react';


export default function UserPage({userId}){

    //State item to define the current user
    const [user, setUser] = useState({userInfo: undefined, orderInfo: undefined});

    //makes load calls when page renders
    useEffect(() =>{
        if(userId !== undefined){
        loadUser(userId);
        loadOrders(userId);
        }
    }, [userId]);


    //load user data into the state 
    const loadUser = async (userId) =>{

        try{

            let res = await fetch(`http://localhost:3001/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            },
        });

            const resJson = await res.json();
            if(resJson === undefined){
                console.log('user not found');
                
            } else{
                setUser((prevUser) => {return {...prevUser, userInfo: resJson}});
                
            }

        } catch (err){
            console.log(err);
        }

    }


    //load user orders into the state
    const loadOrders = async (userId) =>{


        try{

            let res = await fetch(`http://localhost:3001/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            },
        });

            const resJson = await res.json();
            if(resJson === undefined){
                console.log('user orders not found');
                
            } else{
                setUser((prevUser) => {return {...prevUser, orderInfo: resJson}});
                
            }

        } catch (err){
            console.log(err);
        }

    }




//Maybe the two parts of this page should live as their own components? just an idea

    return(
        <div className='user-page'>
            <h1>User Page</h1>
            <div className='user-info'>
                <h2>User Info</h2>
                    <ul>
                        <li>Username: </li>
                        <li>Email: </li>
                        <li>User Id: </li>
                    </ul>
            </div>
            <div className='user-orders'>
                <h2>Orders</h2>
                    <div className='orders-list'>

                    </div>
            </div>
        </div>
    )

}