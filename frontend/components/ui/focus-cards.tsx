// src/components/ui/focus-cards.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Make sure this path is correct
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

export type FocusCardData = {
  id?: string | number;
  title: string;
  description: string;
  src: string;
};

// Individual Card Component
export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: FocusCardData;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const isCurrentlyHovered = hovered === index;
    const isAnotherCardHovered = hovered !== null && hovered !== index;

    // Animation variants for the description text
    const descriptionVariants = {
      hidden: { opacity: 0, y: 10, filter: "blur(2px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.3, ease: "easeOut", delay: 0.1 } },
      exit: { opacity: 0, y: -5, filter: "blur(2px)", transition: { duration: 0.2, ease: "easeIn" } },
    };

    // Variants for the "cosmic dust" overlay
    const dustVariants = {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 0.3, scale: 1, transition: { duration: 0.4, ease: "circOut" } },
      exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "circIn" } },
    };

    return (
      <motion.div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "relative group rounded-lg overflow-hidden transition-all duration-300 ease-out shadow-md", // Softer base shadow
          "w-full aspect-[3/4] max-w-[280px] sm:max-w-[300px]", // Smaller: 3:4 aspect ratio, max-width 280-300px
          isAnotherCardHovered
            ? "blur-sm scale-95 opacity-60" // Effect on non-hovered cards when another is hovered
            : "shadow-xl dark:shadow-2xl", // Enhanced shadow when this or no card is hovered
          "bg-theme-background dark:bg-slate-800/70 border border-theme-border/70 dark:border-slate-700/50" // Themed background and border
        )}
        // Subtle "float" or "lift" animation on hover for the card itself
        whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      >
        {/* Image with subtle parallax/zoom on hover */}
        <Image
          src={card.src}
          alt={card.title}
          layout="fill"
          objectFit="cover"
          className={cn(
            "transition-transform duration-500 ease-out origin-center", // Ensure scaling from center
            isCurrentlyHovered ? "scale-110 brightness-75" : "scale-100 brightness-100 group-hover:scale-105"
          )}
          priority={index < 3} // Prioritize loading images for the first few cards
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" // Adjusted sizes
        />

        {/* Cosmic Dust/Starfield Overlay - Appears on hover */}
        <AnimatePresence>
          {isCurrentlyHovered && (
            <motion.div
              variants={dustVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 z-0 opacity-30" // Base opacity
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                // You can replace this with a subtle transparent PNG of stars or nebula
              }}
            />
          )}
        </AnimatePresence>

        {/* Text Content Container - always present for title positioning */}
        <div
          className={cn(
            "absolute inset-0 z-10 flex flex-col items-center justify-end p-4 text-center", // Padding from bottom
            "bg-gradient-to-t from-black/80 via-black/50 to-transparent", // Darker gradient for better text contrast
            "transition-all duration-300 ease-in-out"
            // Opacity and transform managed by title/description's AnimatePresence
          )}
        >
          {/* Title - Always Visible, but might animate slightly on hover */}
          <motion.h3
            className="text-xl sm:text-2xl font-bold text-white mb-1" // Slightly smaller title, white for contrast
            // Optional: subtle animation for title when card is hovered
            // animate={{ y: isCurrentlyHovered ? -5 : 0, transition: { duration: 0.2 } }}
          >
            {/* Themed gradient for the title text */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 group-hover:from-orange-500 group-hover:to-yellow-500 transition-all">
              {card.title}
            </span>
          </motion.h3>

          {/* Description - Fades in on hover */}
          <AnimatePresence>
            {isCurrentlyHovered && (
              <motion.p
                variants={descriptionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 line-clamp-3" // Lighter text for description
              >
                {card.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
);

Card.displayName = "Card";

// Main FocusCards Component
export function FocusCards({
  cards,
  className,
}: {
  cards: FocusCardData[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (!cards || cards.length === 0) {
    return <p className="text-center text-theme-text-subtle">No projects to display.</p>; // Fallback if used standalone
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4", // More columns on larger screens if desired
        "gap-4 sm:gap-5", // Smaller gap between cards
        "justify-items-center w-full", // Center cards within grid cell
        className
      )}
      onMouseLeave={() => setHovered(null)} // Clear hover when mouse leaves the entire grid
    >
      {cards.map((card, index) => (
        <Card
          key={card.id || card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}