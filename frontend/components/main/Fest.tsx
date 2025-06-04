// src/components/main/Fests.tsx
"use client";
import React, { useRef } from "react";
import { Meteors } from "@/components/ui/meteors"; // Ensure this path is correct
import { motion, useInView } from "framer-motion";
import { Fest } from "@/app/page"; // Ensure this path and type are correct
import Link from "next/link";

// Utility function to strip HTML tags - Preserved from your original
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

// Animation Variants - Preserved from your original
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
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const FestComponent: React.FC<FestComponentProps> = ({ fests }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const isComponentInView = useInView(componentRef, { once: false, amount: 0.1 });

  // --- EMPTY STATE ---
  // Applying theme background and text color, all other classes preserved from your original
  if (!fests || fests.length === 0) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-theme-background py-8 md:py-12" // Original: bg-slate-950
        id="fests"
      >
        <h2 className="text-3xl text-theme-text-subtle"> {/* Original: text-white/70 */}
          No fests to display at the moment.
        </h2>
      </div>
    );
  }

  // --- MAIN COMPONENT ---
  return (
    <motion.div
      ref={componentRef}
      // REMOVED bg-slate-950. All other classes are PRESERVED from your original.
      className="flex min-h-screen flex-col items-center py-12 md:py-20"
      id="fests"
      variants={containerVariants}
      initial="hidden"
      animate={isComponentInView ? "visible" : "hidden"}
    >
      {/* Title: Gradient changed, text-white for second part. All other classes PRESERVED. */}
      <h1 className="text-[36px] sm:text-[40px] lg:text-[48px] font-semibold text-center py-10 sm:py-12 mb-8 md:mb-12">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
          Our Vibrant
        </span>
        <span className="text-neutral-900 dark:text-white"> Fests</span>
      </h1>

      {/* Card Container: All classes PRESERVED from your original. This implies single column. */}
      <div className="w-full max-w-5xl space-y-10 px-4 md:space-y-16">
        {fests.map((fest) => (
          <FestCard key={fest.id} fest={fest} />
        ))}
      </div>
    </motion.div>
  );
};

interface FestCardProps {
  fest: Fest;
}

const FestCard: React.FC<FestCardProps> = ({ fest }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });

  const meteorCardContent = (
    <Meteors
      number={20} // Preserved from your original
      imageUrl={fest.image_url}
      title={fest.festname} // Title color inside Meteors depends on Meteors' internal styling
      description={stripHtml(fest.description)} // Description color inside Meteors depends on Meteors' internal styling
      // className: Modifying ONLY color/border related parts from your original.
      // Original non-color classes are KEPT EXACTLY.
      className={`
        shadow-2xl backdrop-blur-sm group transition-all duration-300 ease-in-out /* PRESERVED from original */
        bg-theme-background dark:bg-slate-800/80            /* REPLACED: bg-slate-900/80 */
        border border-theme-border dark:border-slate-700/60 /* REPLACED: border-transparent. Added dark variant. */
        hover:border-theme-primary dark:hover:border-theme-primary-dark /* REPLACED: group-hover:border-purple-500/50 */
        hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.35)] dark:hover:shadow-[0_0_30px_-5px_rgba(251,146,60,0.45)] /* REPLACED: group-hover shadow with orange/yellow based hardcoded RGBA */
      `}
    />
  );

  // cardMotionProps: className PRESERVED from your original. Hover effect PRESERVED.
  const cardMotionProps = {
    ref: cardRef,
    variants: cardVariants,
    initial: "hidden",
    animate: isInView ? "visible" : "hidden",
    whileHover: {
      scale: 1.03, // Preserved from original
      transition: { duration: 0.2, ease: "circOut" }, // Preserved from original
    },
    className: "block no-underline group", // Preserved from original
  };

  if (fest.link) {
    return (
      <motion.div {...cardMotionProps}>
        <Link href={fest.link} passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" className="block"> {/* className="block" preserved */}
            {meteorCardContent}
          </a>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div {...cardMotionProps}>
      {meteorCardContent}
    </motion.div>
  );
};

export default FestComponent;