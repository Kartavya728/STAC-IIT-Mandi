// src/components/main/Projects.tsx
"use client";

import React from 'react';
import { Project } from '@/app/page';
import { FocusCards, FocusCardData } from '@/components/ui/focus-cards'; // Ensure path is correct
import { motion } from 'framer-motion';

const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=800&auto=format&fit=crop";

interface ProjectsComponentProps {
  projects: Project[];
}

// Utility to strip HTML (if description can contain HTML)
const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>?/gm, '');
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const ProjectsComponent: React.FC<ProjectsComponentProps> = ({ projects }) => {
  // --- EMPTY STATE ---
  // Using theme-aware colors and balanced padding
  if (!projects || projects.length === 0) {
    return (
      <section // Changed to section
        id="projects"
        className="py-20 md:py-28 bg-theme-background min-h-[60vh] flex flex-col items-center justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-theme-text-subtle text-xl sm:text-2xl">
            No projects to display at the moment.
          </p>
        </div>
      </section>
    );
  }

  // Transform Project data to FocusCardData
  const focusCardItems: FocusCardData[] = projects.map(project => ({
    id: project.id,
    title: project.topic,
    // Ensure description is stripped of HTML if it can contain it, and provide a fallback
    description: project.description ? stripHtml(project.description) : "Detailed information coming soon.",
    src: project.image_url || FALLBACK_IMAGE_URL,
  }));

  const containerVariants = {
    hidden: { opacity: 0, y: 30 }, // Softer entry
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5, // Quicker transition
        ease: [0.25, 0.1, 0.25, 1], // Custom ease
        // staggerChildren is less relevant here as FocusCards is a single child.
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2, ease: "easeOut" } },
  };

  return (
    <motion.section // Changed to section
      id="projects"
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-theme-background min-h-screen flex flex-col justify-center"
      // Removed variants from here, will apply to inner content container for better control
      // initial="hidden"
      // whileInView="visible"
      // viewport={{ once: false, amount: 0.1 }} // Reduced amount for earlier trigger if section is tall
    >
      {/* Inner container for content, applies animations */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }} // Animate when 10% of this content block is visible
      >
        <motion.h2
          variants={titleVariants} // Use separate variants for title animation
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center 
                     mb-12 md:mb-16 lg:mb-20" // Generous margin below title
        >
          {/* Title using your fixed orange-yellow gradient */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
            Our Innovative
          </span>
          <span className="text-white"> Projects</span> {/* Fixed color for second part */}
        </motion.h2>

        {/* 
          FocusCards component. Its internal styling is key for professional look.
          It needs to be responsive and use theme-aware colors.
          If FocusCards takes a className, you could try to pass some overrides,
          but ideally, it's built with theming in mind.
        */}
        <FocusCards cards={focusCardItems} />
        {/* Example if FocusCards could take a className for its wrapper:
          <FocusCards cards={focusCardItems} className="w-full ... etc ..." />
        */}
      </motion.div>
    </motion.section>
  );
};

export default ProjectsComponent;