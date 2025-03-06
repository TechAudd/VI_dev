import React from "react";
import logo from "/public/croppedLogo.png";

const Loader = () => {
  return (
    <div className="pointer-events-none flex justify-center items-center fixed inset-0 z-[51] backdrop-blur-sm h-full w-full bg-black/10">
      <img
        src={logo}
        alt="Loading..."
        style={{ width: 48, height: 48 }}
        className="animate-bounce"
      />
    </div>
  );
};

export default Loader;
