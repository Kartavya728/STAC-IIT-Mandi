// src/components/main/Projects.tsx
"use client"; // Required for Framer Motion and useState in FocusCards

import React from 'react';
import { Project } from '@/app/page'; // Assuming Project type is defined here
import { FocusCards, FocusCardData } from '@/components/ui/focus-cards'; // Import the modified FocusCards and its data type
import { motion } from 'framer-motion';

// Fallback image if project.image_url is missing
const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=800&auto=format&fit=crop"; // A generic placeholder

interface ProjectsComponentProps {
  projects: Project[]; // Project type from your app/page.tsx
}

const ProjectsComponent: React.FC<ProjectsComponentProps> = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="py-12 bg-gray-900" id="projects">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-xl">No projects to display at the moment.</p>
        </div>
      </div>
    );
  }

  // Transform Project data to FocusCardData
  const focusCardItems: FocusCardData[] = projects.map(project => ({
    id: project.id,
    title: project.topic,
    description: project.description || "No description available.", // Fallback description
    src: project.image_url || FALLBACK_IMAGE_URL, // Use actual image or fallback
  }));

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1, // Stagger animation for children (if any directly inside motion.div)
      },
    },
  };

  return (
    <motion.div
      className="py-16 md:py-24 bg-gray-900 min-h-screen flex flex-col justify-center" // Ensure it takes enough height
      id="projects"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Triggers animation when in view
      viewport={{ once: false, amount: 0.15 }} // Re-animate on scroll up, triggers when 15% is visible
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} // Slight delay for title after section appears
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Our Innovative Projects
          </span>
        </motion.h2>
        
        <FocusCards cards={focusCardItems} />

      </div>
    </motion.div>
  );
};

export default ProjectsComponent;