// src/components/ui/focus-cards.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Make sure this path is correct

export type FocusCardData = {
  id?: string | number;
  title: string;
  description: string;
  src: string;
};

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: FocusCardData;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative group rounded-xl overflow-hidden transition-all duration-500 ease-out shadow-lg",
        "w-full aspect-square max-w-[350px]", // Max width of 350px, square, and responsive
        hovered !== null && hovered !== index
          ? "blur-md scale-95 opacity-70"
          : "shadow-2xl",
        "bg-neutral-800" // Fallback background
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        layout="fill"
        objectFit="cover"
        className={cn(
          "transition-transform duration-500 ease-out",
          hovered === index ? "scale-110" : "scale-100 group-hover:scale-105"
        )}
        priority={index < 3}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Help Next.js Image optimize
      />
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center p-4 text-center", // p-4 gives 16px padding
          "bg-gradient-to-t from-black/90 via-black/75 to-transparent", // Adjusted gradient slightly
          "transition-all duration-300 ease-in-out",
          hovered === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <h3 className="text-2xl lg:text-3xl font-bold mb-2"> {/* Increased title font size */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            {card.title}
          </span>
        </h3>
        <p className="text-sm md:text-base text-neutral-200 line-clamp-3 sm:line-clamp-4"> {/* Description styling from previous step */}
          {card.description}
        </p>
      </div>
    </div>
  )
);

Card.displayName = "Card";

export function FocusCards({ cards, className }: { cards: FocusCardData[]; className?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8", // Gap between cards
        "justify-items-center", // Centers cards horizontally within their grid cell
        className
      )}
    >
      {cards.map((card, index) => (
        <Card
          key={card.id || card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}