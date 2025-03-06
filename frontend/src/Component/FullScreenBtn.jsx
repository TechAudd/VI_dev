import { MdCloseFullscreen } from "react-icons/md";
import React, { useState } from "react";
import { BiExpandAlt } from "react-icons/bi";

const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <button
      onClick={toggleFullScreen}
      className='p-[6px] border border-slate-500 bg-gray-800 text-white rounded-[4.5px] hover:bg-white hover:text-slate-500'
    >
      {isFullScreen ? <MdCloseFullscreen /> : <BiExpandAlt />}
    </button>
  );
};

export default FullScreenButton;
