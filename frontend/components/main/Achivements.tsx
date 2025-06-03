"use client";

import React, { useRef } from 'react';
import { Achievement } from '@/app/page'; // Assuming this type definition is correct
import { LinkPreview } from '../ui/link-preview'; // Using your actual path
import { motion, useInView } from 'framer-motion';
import { StarIcon, AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/outline';

// Container animation (remains the same)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Card animation - UPDATED FOR FADE-IN/OUT
const cardVariants = {
  hidden: {
    opacity: 0,
    // y: 20, // Optional: if you want a very subtle upward drift on fade-in
  },
  visible: {
    opacity: 1,
    // y: 0,  // Optional: if you used 'y' in hidden state
    transition: {
      duration: 0.5, // Controls the speed of the fade
      ease: "easeInOut", // A common easing for smooth transitions
    },
  },
};

// Random Icon Generator
const getRandomIcon = (id: number) => {
  const icons = [
    <StarIcon key="star" className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-2 sm:mr-3 flex-shrink-0" />,
    <AcademicCapIcon key="cap" className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 mr-2 sm:mr-3 flex-shrink-0" />,
    <TrophyIcon key="trophy" className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mr-2 sm:mr-3 flex-shrink-0" />,
  ];
  return icons[id % icons.length];
};

interface AchievementsComponentProps {
  achievements: Achievement[];
}

const AchievementsComponent: React.FC<AchievementsComponentProps> = ({ achievements }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const isComponentInView = useInView(componentRef, { once: false, amount: 0.1 });

  if (!achievements || achievements.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950" id="achievements">
        <p className="text-white/70">No achievements to display at the moment.</p>
      </div>
    );
  }

  return (
    <motion.div
      ref={componentRef}
      className="py-16 sm:py-24 flex items-center justify-center p-4 bg-gray-950"
      id="achievements"
      variants={containerVariants}
      initial="hidden"
      animate={isComponentInView ? "visible" : "hidden"}
    >
      <div
        className="w-full max-w-4xl p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl relative border border-purple-500/30 bg-gradient-to-br from-slate-900 via-purple-950/50 to-blue-950/50 backdrop-blur-md text-white"
      >
        <motion.h2
          className="relative z-10 text-4xl sm:text-5xl font-bold text-center mb-10 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
          // Title animation can remain pop-up or be changed to fade as well if desired
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={isComponentInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'circOut', delay: 0.1 }}
        >
          Our Achievements
        </motion.h2>

        <ul className="space-y-6 sm:space-y-8 relative z-10">
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index }) => {
  const cardRef = useRef<HTMLLIElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  return (
    <motion.li
      ref={cardRef}
      variants={cardVariants} // Uses the UPDATED cardVariants for fade effect
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      // Hover animation remains the same (pop/scale effect on hover)
      whileHover={{
        y: -6,
        scale: 1.03,
        boxShadow: "0px 8px 25px rgba(168, 85, 247, 0.3), 0px 0px 15px rgba(0, 255, 255, 0.25)",
        transition: { type: 'spring', stiffness: 250, damping: 15 },
      }}
      className="relative group transition-all duration-300" // overflow-hidden was removed previously
    >
      <div
        className="
          block p-5 sm:p-6 rounded-xl
          bg-black/40 group-hover:bg-black/50
          border border-slate-700 group-hover:border-purple-500/70
          backdrop-blur-[2px] group-hover:backdrop-blur-[5px]
          transition-all duration-300 ease-out
          focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-opacity-75
          shadow-lg hover:shadow-xl
        "
      >
        <div className="flex items-start sm:items-center mb-2 sm:mb-3">
          {getRandomIcon(achievement.id)}
          <LinkPreview
            url={achievement.link}
            className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-colors duration-300"
          >
            {achievement.achievement}
          </LinkPreview>
        </div>
        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-500 ease-out"></span>
      </div>
    </motion.li>
  );
};

export default AchievementsComponent;