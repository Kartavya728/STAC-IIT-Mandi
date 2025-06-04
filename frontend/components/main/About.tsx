// components/About.js
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/utils/motion"; // Assuming these variants are defined correctly
import { SparklesIcon } from "@heroicons/react/24/solid";
import SolarSystem from "./Solar"; // Ensure SolarSystem is responsive

const About = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      id="about-stac"
      // UPDATED PADDING:
      // Top padding remains very large on laptops. Bottom padding is removed.
      // Left/Right padding is significantly increased for medium screens and up.
      className="flex flex-col md:flex-row items-center justify-center
                 pt-20 md:pt-28 lg:pt-56 xl:pt-72 pb-0
                 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48
                 w-full z-[20] gap-10 md:gap-16"
      // Original horizontal padding: px-4 sm:px-8 md:px-12 lg:px-20
      // New horizontal padding:      px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48
    >
      {/* Left Column: Text Content */}
      <div className="w-full md:w-1/2 flex flex-col gap-5 justify-center text-center md:text-start">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box flex items-center py-2 px-4 border border-theme-accent-subtle/[.55] bg-theme-accent-subtle/[.10] rounded-lg shadow-sm opacity-[0.9] mx-auto md:mx-0 w-fit"
        >
          <SparklesIcon className="text-theme-accent mr-2.5 h-5 w-5" />
          <h1 className="Welcome-text text-sm font-medium text-theme-text">
            About STAC
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-1 mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold max-w-[600px] w-auto mx-auto md:mx-0"
        >
          <span className="leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
              STAC
            </span>
            <span className="text-theme-text"> IIT Mandi</span>
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-base sm:text-lg text-theme-text-subtle my-5 max-w-[600px] mx-auto md:mx-0 leading-relaxed"
        >
          STAC is a club where one can explore every corner of the technical
          knowledge he/she has! The club enables students to not only enhance
          their knowledge about the different aspects related to astronomy and
          astrophysics but also use the technologies available to develop their
          skills that will help them in future. Its activities include
          observing astronomical objects and bodies, organizing talks about
          astronomy and astrophysics, doing projects related to space
          technology. The club organizes two major fests in an academic year:
          Astrax, an inter-college astro-meet and Zenith, an intra-college
          astronomy fest. There are various discussions, quizzes, talks,
          hackathons that STAC organizes throughout the year.The vision of the
          club is to become self sufficient so that in the coming future, we
          discover new celestial bodies, publish research papers, participate
          and win inter-college events, be a part of the projects by leading
          organisations in the field of astronomy (NASA, ISRO, ESA etc) and
          much more.
        </motion.p>

        <motion.a
          variants={slideInFromLeft(1)}
          href="#projects"
          className="py-3 px-8 text-base font-semibold text-white text-center cursor-pointer rounded-lg max-w-[200px] mx-auto md:mx-0
                     bg-gradient-to-r from-orange-500 to-yellow-500  hover:from-orange-600 hover:to-yellow-600
                     shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
        >
          Learn More!
        </motion.a>
      </div>

      {/* Right Column: SolarSystem Visualization */}
      {/* The SolarSystem will now be in a narrower column due to increased side padding on the parent section */}
      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full md:w-1/2 h-[350px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] flex justify-center items-center mt-10 md:mt-0"
      >
        <SolarSystem />
      </motion.div>
    </motion.section>
  );
};

export default About;