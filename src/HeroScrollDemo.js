import React from "react";
import { ContainerScroll } from "./components/ui/container-scroll-animation";

const HeroScrollDemo = () => {
  return (
  <div className="flex items-center justify-center min-h-screen overflow-visible relative">
      {/* wrapper centers the hero and nudges it right so the heading + image are visually centered on the page
          without modifying the candlestick chart or other layout in App.js */}
      <div className="w-full flex justify-center" style={{ transform: 'translateX(180px)' }}>
        <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white text-center">
              Trade Safer and<br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                More Efficiently
              </span>
            </h1>
          </>
        }
      >
        <img
          src="/example.png" // change image here
          alt="hero"
          loading="lazy"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
        </ContainerScroll>
      </div>
    </div>
  );
};

export default HeroScrollDemo;
