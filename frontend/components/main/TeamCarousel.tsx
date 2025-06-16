'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Linkedin, Instagram, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- Type Definitions ---
interface TeamMember {
  id: number;
  name: string;
  email: string;
  image: string;
  linkedin_url: string | null;
  instagram_url: string | null;
}

interface TeamSection {
  title: string;
  members: TeamMember[];
}

interface Props {
  data: TeamSection[];
}

// --- Animation Variants ---
const carouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // This creates the sequential animation
    },
  },
};

const gridItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


// --- The Carousel Component ---
const TeamCarousel: React.FC<Props> = ({ data }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    let newPage = page + newDirection;
    if (newPage < 0) {
      newPage = data.length - 1; // Wrap to last page
    } else if (newPage >= data.length) {
      newPage = 0; // Wrap to first page
    }
    setPage([newPage, newDirection]);
  };

  const currentSection = data[page];

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      {/* Background title and main container for animation */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={carouselVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, { offset, velocity }) => {
            if (Math.abs(offset.x) > 200 || Math.abs(velocity.x) > 200) {
                paginate(offset.x < 0 ? 1 : -1);
            }
          }}
          className="absolute flex h-[85%] w-[90%] flex-col items-center rounded-3xl bg-card/60 p-6 shadow-2xl backdrop-blur-lg md:p-12"
        >
          {/* Section Title */}
          <h2 className="mb-8 text-4xl font-bold text-primary md:text-5xl">
            {currentSection.title}
          </h2>

          {/* Grid of Team Members with Staggered Animation */}
          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid h-full w-full grid-cols-1 content-start gap-6 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {currentSection.members.map(member => (
              <motion.div
                key={member.id}
                variants={gridItemVariants}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative flex h-80 flex-col items-center rounded-xl bg-background/80 p-4 shadow-lg"
              >
                <div className="relative mb-4 h-32 w-32 flex-shrink-0">
                  <Image
                    src={member.image || '/default-avatar.png'}
                    alt={`Photo of ${member.name}`}
                    fill
                    className="rounded-full border-4 border-secondary object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                
                {/* Social Links */}
                <div className="mt-auto flex space-x-4 pt-4">
                  {member.linkedin_url && (
                    <Link href={member.linkedin_url} target="_blank" className="text-muted-foreground transition hover:text-primary"><Linkedin/></Link>
                  )}
                  {member.instagram_url && (
                    <Link href={member.instagram_url} target="_blank" className="text-muted-foreground transition hover:text-primary"><Instagram/></Link>
                  )}
                  <a href={`mailto:${member.email}`} className="text-muted-foreground transition hover:text-primary"><Mail/></a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 z-10 w-full max-w-7xl -translate-y-1/2 transform px-4">
        <button onClick={() => paginate(-1)} className="absolute left-0 rounded-full bg-card/50 p-2 text-foreground transition hover:bg-primary hover:text-primary-foreground"><ChevronLeft size={28} /></button>
        <button onClick={() => paginate(1)} className="absolute right-0 rounded-full bg-card/50 p-2 text-foreground transition hover:bg-primary hover:text-primary-foreground"><ChevronRight size={28} /></button>
      </div>
      
      {/* Pagination Dots */}
      <div className="absolute bottom-8 z-10 flex space-x-2">
        {data.map((_, i) => (
          <button key={i} onClick={() => setPage([i, i > page ? 1 : -1])}
             className={`h-2 w-2 rounded-full transition-all ${i === page ? 'w-6 bg-primary' : 'bg-muted-foreground/50'}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TeamCarousel;