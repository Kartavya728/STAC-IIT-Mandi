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
    // For server-side rendering or environments without DOMParser
    return html.replace(/<[^>]*>?/gm, '');
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const ProjectsComponent: React.FC<ProjectsComponentProps> = ({ projects }) => {
  // --- EMPTY STATE ---
  if (!projects || projects.length === 0) {
    return (
      <section
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
    description: project.description ? stripHtml(project.description) : "Detailed information coming soon.",
    src: project.image_url || FALLBACK_IMAGE_URL,
  }));

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="projects"
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-theme-background min-h-screen flex flex-col justify-center"
    >
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
      >
        <motion.h2
          variants={titleVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center
                     mb-12 md:mb-16 lg:mb-20"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
            Our Innovative
          </span>
          {/*
            Updated "Projects" text:
            - text-neutral-900: Sets text to a dark gray/off-black in light theme.
            - dark:text-white: Sets text to white in dark theme.
            (Assumes Tailwind CSS dark mode is configured, e.g., darkMode: 'class')
          */}
          <span className="text-neutral-900 dark:text-white"> Projects</span>
        </motion.h2>

        {/*
          FocusCards component.
          The className "w-full flex flex-wrap justify-center" helps center the last row of cards
          if it's not full, assuming FocusCards applies these flex properties to its card container.
        */}
        <FocusCards
          cards={focusCardItems}
          className="w-full flex flex-wrap justify-center"
        />

        {/*
          IMPORTANT NOTE ON CARD HOVER EFFECTS:
          The requested hover effects (title centering/enlarging, description enlarging)
          need to be implemented *within* the `FocusCards` component or the individual
          card component it renders. This `ProjectsComponent` cannot directly style
          the internal elements of `FocusCards` in a robust and reliable way.

          Guidance for implementing these effects in `FocusCards` (or its card sub-component):

          1. Add the `group` class to the main wrapper of each card:
             Example: `<div className="group relative ...other card styles..."> ...card content... </div>`

          2. Style the card's title element using `group-hover:` utilities for transform,
             text alignment, and font size/scaling. Also add transition utilities:
             Example:
             `<h3 className="card-title text-left text-xl font-semibold transition-all duration-300 ease-in-out group-hover:text-center group-hover:scale-105 group-hover:text-2xl">
                {card.title}
              </h3>`
             (Adjust `scale-105`, `text-2xl`, etc., as per desired enlargement)

          3. Style the card's description element using `group-hover:` for font size
             increase. Also add transition utilities:
             Example:
             `<p className="card-description text-sm text-gray-600 dark:text-gray-400 mt-2 transition-all duration-300 ease-in-out group-hover:text-base">
                {card.description}
              </p>`
             (Adjust `text-base` or other size classes as needed for "larger font size")

          4. Ensure `transition-all duration-300 ease-in-out` (or similar transition classes)
             are applied to the title and description elements within the card for smooth animations.
        */}
      </motion.div>
    </motion.section>
  );
};

export default ProjectsComponent;