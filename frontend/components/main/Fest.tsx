// src/components/main/Fests.tsx
"use client";
import React, { useRef } from "react";
import { Meteors } from "@/components/ui/meteors"; // Assuming Meteors component is correctly styled internally
import { motion, useInView } from "framer-motion";
import { Fest } from "@/app/page"; // Assuming Fest type is defined in app/page.tsx
import Link from "next/link";

// Utility function to strip HTML tags
const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>?/gm, '');
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

interface FestComponentProps {
  fests: Fest[];
}

// Animation Variants for the individual fest cards
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  // exit is implicitly handled by useInView changing animate prop
};

// Animation Variants for the main component container (subtle fade-in for the heading)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      // Stagger children can be applied here if cards are direct children of this motion.div
      // and not wrapped by another div. For now, individual cards will handle their animation.
    },
  },
};

const FestComponent: React.FC<FestComponentProps> = ({ fests }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  // useInView for the whole component - useful for overall container animation (like the title)
  const isComponentInView = useInView(componentRef, { once: false, amount: 0.1 });

  if (!fests || fests.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 py-8 md:py-12" id="fests">
        <h2 className="text-3xl text-white/70">No fests to display at the moment.</h2>
      </div>
    );
  }

  return (
    <motion.div
      ref={componentRef}
      className="flex min-h-screen flex-col items-center bg-slate-950 py-12 md:py-20"
      id="fests"
      variants={containerVariants}
      initial="hidden"
      animate={isComponentInView ? "visible" : "hidden"}
    >
      {/* Theme-aligned heading */}
      <h1 className="text-[36px] sm:text-[40px] lg:text-[48px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10 sm:py-12 text-center mb-8 md:mb-12">
        Our Vibrant Fests
      </h1>

      <div className="w-full max-w-5xl space-y-10 px-4 md:space-y-16">
        {fests.map((fest) => (
          <FestCard key={fest.id} fest={fest} />
        ))}
      </div>
    </motion.div>
  );
};

// Separate FestCard component for individual animations and hover effects
interface FestCardProps {
  fest: Fest;
}

const FestCard: React.FC<FestCardProps> = ({ fest }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  // useInView for each card - triggers animation when this specific card enters/leaves view
  // once: false ensures it re-animates on scroll up
  // amount: 0.2 means 20% of the card needs to be visible
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });

  const meteorCardContent = (
    <Meteors
      number={20} // Or make this dynamic
      imageUrl={fest.image_url}
      title={fest.festname}
      description={stripHtml(fest.description)}
      // Theme-aligned styling for Meteors component card itself
      className="shadow-2xl backdrop-blur-sm bg-slate-900/80 border border-transparent group-hover:border-purple-500/50 transition-all duration-300 ease-in-out group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)]"
      // You might need to pass titleClassName and descriptionClassName if Meteors supports it
      // titleClassName="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400" // Example
    />
  );

  const cardMotionProps = {
    ref: cardRef,
    variants: cardVariants,
    initial: "hidden",
    animate: isInView ? "visible" : "hidden", // Animate based on individual card's visibility
    // Add hover effect directly on the motion.div
    whileHover: {
      scale: 1.03, // Slightly scale up on hover
      // boxShadow: "0px 10px 30px -5px rgba(168, 85, 247, 0.4)", // Purple glow from your theme
      transition: { duration: 0.2, ease: "circOut" },
    },
    className: "block no-underline group", // 'group' for group-hover on Meteors
  };

  if (fest.link) {
    return (
      <motion.div {...cardMotionProps}>
        <Link href={fest.link} passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" className="block"> {/* Ensure anchor tag covers the motion.div for hover */}
            {meteorCardContent}
          </a>
        </Link>
      </motion.div>
    );
  }

  // If no link, the motion.div itself is the card
  return (
    <motion.div {...cardMotionProps}>
      {meteorCardContent}
    </motion.div>
  );
};

export default FestComponent;