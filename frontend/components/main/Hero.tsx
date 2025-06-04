"use client"; // Keep if HeroContent or other parts need it
import React from "react";
import HeroContent from "../sub/HeroContent";

const Hero = () => {
  return (
    <div className="relative flex flex-col h-full w-full" id="about-me">
      <video
        autoPlay
        muted
        loop
        className="rotate-180 top-[-330px] absolute h-full w-full left-0 z-[-1] object-cover 
                   filter hue-rotate-[140deg]
                   opacity-0 dark:opacity-100 transition-opacity duration-500 ease-in-out"
        // Key changes:
        // opacity-0: Makes it invisible by default (light mode)
        // dark:opacity-100: Makes it fully visible in dark mode
        // transition-opacity duration-500 ease-in-out: Adds a smooth fade effect
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video>

      {/* The HeroContent should ideally have a background of its own or the parent div
          should have a light mode background if the video isn't showing.
          Otherwise, HeroContent might appear on a transparent background in light mode.
      */}
      <HeroContent />
    </div>
  );
};

export default Hero;