import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from './Components/Login';
import Register from './Components/Register';
import "./App.css"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path:"/register",
    element: <Register />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />

  );
}

export default App;
