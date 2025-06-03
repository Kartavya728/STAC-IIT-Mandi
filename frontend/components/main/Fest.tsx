// src/components/main/Fests.tsx
"use client";
import React from "react";
import { Meteors } from "@/components/ui/meteors";
import { motion } from "framer-motion";
import { Fest } from "@/app/page";
import Link from "next/link"; // Import Link for linking

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

const festContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const FestComponent: React.FC<FestComponentProps> = ({ fests }) => {
  if (!fests || fests.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 py-12 md:py-20" id="fests">
        <h2 className="text-3xl text-white/70">No fests to display at the moment.</h2>
      </div>
    );
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center bg-slate-950 py-12 md:py-20"
      id="fests"
      variants={festContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-[36px] sm:text-[40px] lg:text-[48px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 py-10 sm:py-12 text-center mb-8 md:mb-12">
        Our Vibrant Fests
      </h1>
      <div className="w-full max-w-5xl space-y-10 px-4 md:space-y-16">
        {fests.map((fest) => {
          const meteorCard = (
            <Meteors
              key={fest.id} // Key should be on the outermost element if Meteors is wrapped
              number={20}
              // CORRECTED: Use fest.image_url which contains the full absolute URL
              imageUrl={fest.image_url}
              title={fest.festname}
              description={stripHtml(fest.description)}
              className="shadow-2xl backdrop-blur-sm bg-slate-900/70 border border-slate-800"
            />
          );

          // If fest.link exists and you want the card to be clickable
          if (fest.link) {
            return (
              <Link key={fest.id} href={fest.link} passHref legacyBehavior>
                <a target="_blank" rel="noopener noreferrer" className="block no-underline">
                  {meteorCard}
                </a>
              </Link>
            );
          }
          return meteorCard; // Render without link if no fest.link
        })}
      </div>
    </motion.div>
  );
};

export default FestComponent;