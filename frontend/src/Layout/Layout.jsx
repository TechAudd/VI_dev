import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Component/Navbar";

const Layout = () => {
  return (
    <>
      <div className="bg-gray-100">
        <Navbar />
        <div
          className="xl:ml-20 ml-0 p-0 lg-p-4 bg-cover bg-center"
        // style={{
        //   backgroundImage: "url('/public/bg.webp')",
        // }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;