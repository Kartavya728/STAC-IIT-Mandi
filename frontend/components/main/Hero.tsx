import React from "react";
import HeroContent from "../sub/HeroContent";
import { source } from "motion/react-client";

const Hero = () => {
  return (
    <div className="relative flex flex-col h-full w-full" id="about-me">
      <video
        autoPlay
        muted
        loop
        className="rotate-180 top-[-330px] absolute h-full w-full left-0 z-[-1] object-cover "
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video>
<HeroContent />
      
    </div>
  );
};

export default Hero;
