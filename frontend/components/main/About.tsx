"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/utils/motion"; // Assuming these variants are defined correctly
import { SparklesIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import SolarSystem from "./Solar";

const About = () => {
  return (
    <motion.div
      // Animation control:
      initial="hidden" // Start in the "hidden" state of your variants
      whileInView="visible" // Animate to "visible" state when in viewport
      viewport={{ once: false, amount: 0.3 }} // Trigger every time, when 30% is visible
      // Spacing and Layout:
      // Reduced mt-40 to mt-16 or mt-20 for less top space. Adjust as needed.
      // You can also use py-16 (padding top/bottom) if you prefer padding.
      className="flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 md:px-12 lg:px-20 mt-16 md:mt-20 w-full z-[20] gap-8 md:gap-12"
      // Added responsive padding, gap between text & image.
      // Changed to flex-col on small screens, md:flex-row for larger.
    >
      {/* Left Column: Text Content */}
      <div className="w-full md:w-1/2 flex flex-col gap-5 justify-center text-center md:text-start">
        {/* Welcome Box - Keep animation as is, or apply to parent */}
        <motion.div
          variants={slideInFromTop} // This will be triggered by the parent's whileInView
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] mx-auto md:mx-0 w-fit" // w-fit and mx adjustments
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">About</h1>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          variants={slideInFromLeft(0.5)} // Triggered by parent's whileInView
          className="flex flex-col gap-3 sm:gap-4 mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-[600px] w-full h-auto mx-auto md:mx-0"
          // Adjusted font sizes and gap
        >
          <span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              {" "}
              STAC{" "}
            </span>
            IIT Mandi
          </span>
        </motion.div>

        {/* Paragraph */}
        <motion.p
          variants={slideInFromLeft(0.8)} // Triggered by parent's whileInView
          className="text-base sm:text-lg text-gray-400 my-5 max-w-[600px] mx-auto md:mx-0"
          // Adjusted font size
        >
STAC is a club where one can explore every corner of the technical knowledge he/she has! The club enables students to not only enhance their knowledge about the different aspects related to astronomy and astrophysics but also use the technologies available to develop their skills that will help them in future. Its activities include observing astronomical objects and bodies, organizing talks about astronomy and astrophysics, doing projects related to space technology. The club organizes two major fests in an academic year: Astrax, an inter-college astro-meet and Zenith, an intra-college astronomy fest. There are various discussions, quizzes, talks, hackathons that STAC organizes throughout the year.The vision of the club is to become self sufficient so that in the coming future, we discover new celestial bodies, publish research papers, participate and win inter-college events, be a part of the projects by leading organisations in the field of astronomy (NASA, ISRO, ESA etc) and much more.
        </motion.p>

        {/* Button */}
        <motion.a
          variants={slideInFromLeft(1)} // Triggered by parent's whileInView
          href="#" // Add a valid href for accessibility and functionality
          className="py-2 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px] mx-auto md:mx-0"
          // Consider adding hover/focus states for button-primary if not already defined globally
        >
          Learn More!
        </motion.a>
      </div>

      {/* Right Column: Image Content */}
      <motion.div
        variants={slideInFromRight(0.8)} // Triggered by parent's whileInView
        className="w-full md:w-1/2 h-full flex justify-center items-center mt-8 md:mt-0"
        // Added mt-8 on small screens for spacing when stacked vertically
      >
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
      <SolarSystem />
    </main>
      </motion.div>
    </motion.div>
  );
};

export default About;