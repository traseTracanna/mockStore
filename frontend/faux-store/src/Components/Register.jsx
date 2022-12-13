import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';


export default function(props){
    const navigate = useNavigate();
    const navToLogin = () =>{
        navigate('/login');
    }

    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        try{
            let res = await fetch('http://localhost:3001/user/register', {
                method: "POST",
                headers: {
                  "Content-type": "application/json"
                },
                body: JSON.stringify({username: username, 
                  email: email, 
                  password: password}),
            });
            
            let resJson = await res.json();
            if(resJson.rowCount === 1){
                setName("");
                setEmail("");
                setPassword("");
                setMessage("User Created Successfully");
            } else{
                setMessage("Some Error occured");
            }
        } catch (err) {
            alert(err);
                console.log(err);
            }
    };

return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={navToLogin}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <div className="text-center mt-2">{message ? <p>{message}</p> : <p>test</p>}</div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  );
}