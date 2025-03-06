import React from "react";
import loadingAnimation from '../assets/Webseeder logo animation v4.mp4';

const Loader = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex justify-center items-center">
      <div className="size-60">
        <video src={loadingAnimation} muted autoPlay loop />
      </div>
    </div>
  );
};

export default Loader;
