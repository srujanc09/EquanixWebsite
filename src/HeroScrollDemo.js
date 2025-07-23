import React from "react";
import { ContainerScroll } from "./components/ui/container-scroll-animation";

const HeroScrollDemo = () => {
  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden relative">
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
          src="https://ui.aceternity.com/_next/image?url=%2Flinear.webp&w=3840&q=75" //change to my image 
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
};

export default HeroScrollDemo;
