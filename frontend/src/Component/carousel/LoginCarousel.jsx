import React, { useEffect } from "react";
import Carousel from "./Carousel";
import carouselImage1 from "/public/carousel-images/1.webp";
import carouselImage2 from "/public/carousel-images/2.webp";
import carouselImage3 from "/public/carousel-images/3.webp";

const LoginCarousel = () => {
  const slides = [
    {
      image: carouselImage1,
      name: "Innovative Education",
      text: "Experience cutting-edge academic programs designed for the future.",
    },
    {
      image: carouselImage2,
      name: "World-Class Facilities",
      text: "Explore our state-of-the-art campus and world-class infrastructure.",
    },
    {
      image: carouselImage3,
      name: "Global Opportunities",
      text: "Unlock global opportunities through our international collaborations.",
    },
  ].map((data) => {
    return (
      <div className="h-screen w-full relative" key={data.name}>
        <img
          src={data.image}
          className="h-full w-full object-cover object-center"
          alt={data.name}
        />
        <div className="absolute px-8 py-24 top-0 left-0 h-full w-full flex flex-col justify-end items-start text-white bg-black/50 gap-4">
          <h2 className="text-2xl font-bold text-white">{data.name}</h2>
          <h2 className="max-w-xs text-white">{data.text}</h2>
        </div>
      </div>
    );
  });

  useEffect(() => { }, []);

  return (
    <div className="w-full overflow-hidden flex flex-col justify-evenly items-center col-span-2">
      <div className="h-screen w-full loginpage relative">
        <Carousel data={slides} setnum={1} setmode="fadeout" />
      </div>
    </div>
  );
};

export default LoginCarousel;
