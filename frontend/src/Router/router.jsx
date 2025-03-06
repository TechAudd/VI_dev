import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Component/Home";
import CheckAuth from "../Component/CheckAuth";
import Login from "../Component/login/Login";
import Register from "../Component/login/Register";
import CreateForm from "../Component/form/CreateForm";
import Layout from "../Layout/Layout"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CheckAuth>
        <Layout />
      </CheckAuth>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/createForm",
        element: <CreateForm />
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
