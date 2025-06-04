// src/components/main/Achievements.tsx
"use client";
import React, { useRef } from 'react';
import { Achievement } from '@/app/page';
import { LinkPreview } from '../ui/link-preview'; // Ensure this path is correct
import { motion, useInView } from 'framer-motion';
import { StarIcon, AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/outline'; // Using outline for consistency

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4, // Slightly quicker
      staggerChildren: 0.1, // Stagger list items
      delayChildren: 0.1,  // Start staggering sooner
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 }, // Subtle slide-in from left
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // Custom ease
    },
  },
};

// Random Icon Generator - Themed Icons
const getRandomIcon = (id: number) => {
  const icons = [
    <StarIcon key="star" className="w-5 h-5 sm:w-6 sm:h-6 text-theme-secondary mr-2 sm:mr-3 flex-shrink-0" />, // Yellowish theme color
    <AcademicCapIcon key="cap" className="w-5 h-5 sm:w-6 sm:h-6 text-theme-primary mr-2 sm:mr-3 flex-shrink-0" />, // Orange theme color
    <TrophyIcon key="trophy" className="w-5 h-5 sm:w-6 sm:h-6 text-theme-accent-1 mr-2 sm:mr-3 flex-shrink-0" />, // Accent theme color
  ];
  return icons[id % icons.length];
};

interface AchievementsComponentProps {
  achievements: Achievement[];
}

const AchievementsComponent: React.FC<AchievementsComponentProps> = ({ achievements }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  // Trigger when 10% of the main section is in view
  const isComponentInView = useInView(componentRef, { once: false, amount: 0.1 });

  // --- EMPTY STATE ---
  if (!achievements || achievements.length === 0) {
    return (
      <section // Changed to section
        id="achievements"
        className="min-h-[60vh] flex items-center justify-center p-4 bg-theme-background"
      >
        <p className="text-xl sm:text-2xl text-theme-text-subtle text-center">
          No achievements to display yet.
        </p>
      </section>
    );
  }

  // --- MAIN COMPONENT ---
  return (
    <motion.section // Changed to section
      ref={componentRef}
      id="achievements"
      // Professional padding, bg-theme-background inherited or set on body
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-theme-background flex items-center justify-center px-4"
      // Variants moved to the inner content box for better animation control relative to its appearance
    >
      {/* Content Box with Themed Styling and Animation */}
      <motion.div
        className="w-full max-w-3xl lg:max-w-4xl p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl dark:shadow-2xl relative
                   border border-theme-border/70 dark:border-theme-border/40
                   bg-theme-background/80 dark:bg-slate-900/60 backdrop-blur-md text-theme-text"
        // Themed background: theme background with some opacity for glassmorphism, or a subtle gradient
        // Example subtle gradient: bg-gradient-to-br from-theme-background/80 via-theme-accent-1/5 to-theme-background/80 dark:from-slate-900/70 dark:via-theme-primary/10 dark:to-slate-900/70
        variants={containerVariants} // Apply container variants here for children staggering
        initial="hidden"
        animate={isComponentInView ? "visible" : "hidden"}
        viewport={{ once: false, amount: 0.2 }} // Trigger when 20% of this box is visible
      >
        <motion.h2
          className="relative z-10 text-4xl sm:text-5xl font-bold text-center mb-10 sm:mb-12 md:mb-16"
          // Title animation
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }} // Animation controlled by parent's isInView
          transition={{ duration: 0.5, ease: 'circOut', delay: 0.1 }} // Delay relative to parent animation
        >
          {/* Themed Title */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
            Our
          </span>
          <span className="text-neutral-900 dark:text-white"> Achievements</span> {/* Fixed color */}
        </motion.h2>

        <ul className="space-y-5 sm:space-y-6 relative z-10"> {/* Slightly reduced space-y */}
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </ul>
      </motion.div>
    </motion.section>
  );
};

interface AchievementCardProps {
  achievement: Achievement;
  index: number; // index can be used for staggered animation if cardVariants are applied by parent
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index }) => {
  const cardRef = useRef<HTMLLIElement>(null);
  // Card animation can be triggered by individual visibility or by parent staggering.
  // For simplicity with parent staggering, we might not need individual useInView here if parent handles it.
  // const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  return (
    <motion.li
      ref={cardRef}
      variants={cardVariants} // These variants will be triggered by the parent motion.div (ul's container)
      // initial="hidden" // Handled by parent
      // animate={isInView ? "visible" : "hidden"} // Handled by parent staggering
      whileHover={{
        y: -5, // Subtle lift
        scale: 1.015, // Subtle scale
        // Themed shadow glow - ensure --theme-primary-glow is defined
        boxShadow: "0px 6px 20px rgba(var(--rgb-theme-primary), 0.25), 0px 0px 12px rgba(var(--rgb-theme-accent-1), 0.2)",
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className="relative group" // Removed transition-all, motion handles it. overflow-hidden might be needed if children visually overflow on hover.
    >
      <div
        className="
          block p-4 sm:p-5 rounded-lg sm:rounded-xl  // Slightly reduced padding, responsive rounding
          bg-theme-background/60 dark:bg-slate-800/50   // Card item background
          group-hover:bg-theme-background/70 dark:group-hover:bg-slate-800/70 // Hover background
          border border-theme-border/50 dark:border-slate-700/40       // Card item border
          group-hover:border-theme-primary/80 dark:group-hover:border-theme-primary-dark/80 // Hover border
          backdrop-blur-sm group-hover:backdrop-blur-md       // Glassmorphism
          transition-all duration-200 ease-out              // Smooth transition for non-motion properties
          shadow-md group-hover:shadow-lg                     // Subtle shadow
        "
      >
        <div className="flex items-start sm:items-center mb-2"> {/* Reduced bottom margin */}
          {getRandomIcon(achievement.id)}
          <LinkPreview
            url={achievement.link}
            // Themed LinkPreview text and hover effect
            className="text-md sm:text-lg lg:text-xl font-medium text-theme-text group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-yellow-500 transition-colors duration-300"
            // If LinkPreview accepts a 'previewClassName' or similar for its popup, theme that too.
          >
            {achievement.achievement}
          </LinkPreview>
        </div>
        {/* Themed underline hover effect */}
        <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-400 ease-out"></span>
      </div>
    </motion.li>
  );
};

export default AchievementsComponent;