import React, {useState} from 'react';
import Store from './Store';
import UserPage from './UserPage';
import {useNavigate} from 'react-router-dom';

//Have this be the parent route of all other pages: user, store, cart
//See the routes tutorial from React developers for more clarity
//The idea is to essentially have this be static across all pages after login for navigation


export default function NavBar(){

    const [displayer, setDisplayer] = useState(true);
    const navigate = useNavigate();



    return(
        <div className='app'>
            <div className='nav-bar'>
                <div className='user-page-button'>
                    <button onClick={() => {setDisplayer(false)}}>User Page</button>
                </div>
                <div className='store-page-button'>
                    <button onClick={()=> {setDisplayer(true)}}>Store Page</button>
                </div>
                <div className='logout-button'>
                    <button onClick={()=>{navigate('/')}}>Logout</button>
                </div>
            </div>
            <div className='display-page'>
                {displayer ? <Store /> : <UserPage />}
            </div>
        </div>




    )
}