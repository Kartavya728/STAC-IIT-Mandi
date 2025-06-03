"use client";
import { cn } from "@/lib/utils"; // Assuming this is your utility for classnames
import { motion } from "framer-motion";
import React from "react";

export const Meteors = ({
  number,
  className,
  imageUrl,
  title,
  description,
}: {
  number?: number;
  className?: string;
  imageUrl: string;
  title: string;
  description: string;
}) => {
  const meteorCount = number || 20;
  const meteorsArray = new Array(meteorCount).fill(true);

  return (
    <motion.div
      // Card entrance animation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Main card container: 3/4 screen width on medium screens and up, full width on small, centered
      className={cn(
        "relative mx-auto w-full max-w-3xl md:w-3/4",
        className // Allows additional custom styling for the card container
      )}
    >
      {/* Optional: Background decorative blur effect (from original Fest card) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-[0.85] transform rounded-full bg-gradient-to-r from-blue-500 to-teal-500 opacity-30 blur-3xl"
      />

      {/* Inner wrapper for content, meteors, border, and background */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/90 p-4 shadow-xl backdrop-blur-sm md:p-6">
        {/* Content Section: Image, Title, Description */}
        <div className="relative z-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <img
            src={imageUrl}
            alt={title || "Card image"}
            className="h-24 w-24 flex-shrink-0 rounded-lg object-cover shadow-md sm:h-28 sm:w-28"
          />
          <div className="flex flex-1 flex-col text-center sm:text-left">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {title}
            </h2>
            <p className="mt-2 text-base text-slate-300">
              {description}
            </p>
          </div>
        </div>

        {/* Meteor Effect Elements - positioned absolutely within the inner wrapper */}
        {meteorsArray.map((_, idx) => (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-400 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-slate-500 before:to-transparent before:content-['']"
            )}
            style={{
              top: Math.random() * 20 - 10 + "%", // Start slightly above or within the top 20%
              left: Math.random() * 100 + "%", // Random horizontal position across the card
              animationDelay: Math.random() * (meteorCount / 5) + "s", // Spread out delays
              animationDuration: Math.floor(Math.random() * 5 + 5) + "s", // Duration 5s to 10s
              // Meteors are z-0 (or z-auto) by default. Content is z-10.
              // So meteors render between the card's background and its textual/image content.
            }}
          ></span>
        ))}
      </div>
    </motion.div>
  );
};