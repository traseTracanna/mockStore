import React from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from './Components/Login';
import Register from './Components/Register';
import Store from './Components/Store';
import "./App.css"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path:"/register",
    element: <Register />
  },
  {
    path:"/store",
    element: <Store />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />

  );
}

export default App;
