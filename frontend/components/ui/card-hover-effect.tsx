"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Linkedin, Instagram, Mail } from "lucide-react";

// Interface is unchanged
export interface HoverCardItem {
  image: string;
  title: string;
  description: string;
  link?: string;
  email?: string;
  linkedin_url?: string | null;
  instagram_url?: string | null;
}

export const HoverEffect = ({
  items,
  className,
}: {
  items: HoverCardItem[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "flex flex-wrap justify-center py-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.title + idx}
          className="relative group block p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                // --- CHANGED HERE ---
                // We replaced the solid background colors with the gradient classes.
                // I've also added an opacity-75 to make it slightly transparent,
                // which often looks better for hover effects. You can remove it for a solid gradient.
               className="absolute inset-0 h-full w-full bg-gradient-to-r from-orange-500/50 to-yellow-500/50 dark:from-orange-500/50 dark:to-yellow-500/50 block rounded-3xl"

                // --------------------
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card item={item} />
        </div>
      ))}
    </div>
  );
};

// The Card component and others below remain unchanged.
export const Card = ({
  className,
  item,
}: {
  className?: string;
  item: HoverCardItem;
}) => {
  return (
    <div
      className={cn(
        "w-64 aspect-square overflow-hidden",
        "h-full rounded-2xl bg-white dark:bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20 flex flex-col",
        className
      )}
    >
      <div className="h-[70%] w-full relative">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="h-[30%] w-full p-3 flex flex-col justify-between bg-white dark:bg-black">
        <CardTitle>{item.title}</CardTitle>
        <div className="flex items-center gap-4">
          {item.email && (
            <a href={`mailto:${item.email}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label={`${item.title}'s Email`}>
              <Mail className="h-5 w-5" />
            </a>
          )}
          {item.linkedin_url && (
            <a href={item.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label={`${item.title}'s LinkedIn`}>
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {item.instagram_url && (
            <a href={item.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label={`${item.title}'s Instagram`}>
              <Instagram className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-800 dark:text-zinc-100 font-bold tracking-wide text-sm md:text-base", className)}>
      {children}
    </h4>
  );
};