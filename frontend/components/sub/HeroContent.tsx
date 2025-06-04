"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ... (Star component remains the same, but ensure its boxShadow uses theme variables as discussed before)
interface StarProps {
  delay: number;
  size: number;
  top: number;
  left: number;
}

const Star: React.FC<StarProps> = ({ delay, size, top, left }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 0.8, 0],
        scale: [0.5, 1.2, 1, 0.5],
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        duration: 1.5 + Math.random(),
        delay: delay + Math.random() * 0.3,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        // Ensure --rgb-theme-primary and --rgb-theme-accent-1 (or similar) are defined in globals.css
        // based on your main theme-primary and theme-accent-1 for the glow effect.
        boxShadow: "0 0 6px 1px rgba(255,255,255,0.7), 0 0 10px 3px rgba(var(--rgb-theme-primary)/0.5), 0 0 15px 5px rgba(var(--rgb-theme-accent-1)/0.3)",
      }}
    />
  );
};


const HeroContent = () => {
  const [isStacHovered, setIsStacHovered] = useState(false);
  const [isIitHovered, setIsIitHovered] = useState(false);

  const stacUnits = [
    { char: "S", expansion: "pace", id: "s" },
    { char: "T", expansion: "echnology", id: "t" },
    { char: "A", expansion: "stronomy", id: "a" },
    { char: "C", expansion: "ell", id: "c" },
  ];

  const mainCharFontSizeClasses =
    "text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[130px]";
  const expansionTextFontSizeClasses =
    "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl";
  const expandedWordSpacing = "max(0.3em, min(0.8em, 1.5vw))";
  const professionalEase = [0.42, 0, 0.58, 1];

  const iitStars = React.useMemo(() => [
    // ... (iitStars array remains the same) ...
    { id: 1, delay: 0, size: 2, top: 10, left: 5 },
    { id: 2, delay: 0.2, size: 1.5, top: 80, left: 15 },
    { id: 3, delay: 0.1, size: 2.5, top: 25, left: 90 },
    { id: 4, delay: 0.3, size: 1, top: 60, left: 100 },
    { id: 5, delay: 0.15, size: 2, top: -10, left: 40 },
    { id: 6, delay: 0.25, size: 1.8, top: 50, left: -5 },
  ], []);


  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full z-[20]
                 px-2 sm:px-4 md:px-6 lg:px-8
                 mt-40 
                 min-h-[550px] sm:min-h-[600px] md:min-h-[650px]
                 pb-0
                 text-foreground"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, ease: professionalEase }}
    >
      <div className="text-center cursor-default w-full">
        <motion.h1
          layout
          onMouseEnter={() => setIsStacHovered(true)}
          onMouseLeave={() => setIsStacHovered(false)}
          className={`font-bold text-foreground leading-none flex items-baseline justify-center flex-wrap ${
            isStacHovered
              ? "tracking-normal"
              : "tracking-[-0.07em] sm:tracking-[-0.06em] md:tracking-[-0.05em]"
          }`}
          transition={{ duration: 0.5, ease: professionalEase }}
        >
          {stacUnits.map((unit, index) => (
            <motion.div
              layout
              key={unit.id}
              className="inline-flex items-baseline whitespace-nowrap"
              animate={{
                marginLeft:
                  index > 0 && isStacHovered ? expandedWordSpacing : "0em",
              }}
              transition={{
                duration: 0.4,
                ease: professionalEase,
                delay: isStacHovered
                  ? index * 0.06
                  : (stacUnits.length - 1 - index) * 0.04 + 0.1,
              }}
            >
              <motion.span
                layout="position"
                className={`relative z-10 ${mainCharFontSizeClasses} text-foreground drop-shadow-[0_0_8px_hsl(var(--theme-primary)/0.7)] dark:drop-shadow-[0_0_12px_hsl(var(--theme-primary)/0.9)]`}
              >
                {unit.char}
              </motion.span>
              <span className="inline-block overflow-hidden align-baseline">
                <AnimatePresence initial={false}>
                  {isStacHovered && (
                    <motion.span
                      key={`${unit.id}-expansion`}
                      initial={{ width: 0, opacity: 0.5, x: "-15px" }}
                      animate={{
                        width: "auto",
                        opacity: 1,
                        x: "0px",
                        transition: {
                          duration: 0.4,
                          delay: index * 0.08 + 0.05,
                          ease: professionalEase,
                        },
                      }}
                      exit={{
                        width: 0,
                        opacity: 0,
                        x: "-15px",
                        transition: {
                          duration: 0.25,
                          delay: (stacUnits.length - 1 - index) * 0.03,
                          ease: [0.58, 0, 0.42, 1],
                        },
                      }}
                      // *** UPDATED CLASS HERE ***
                      className={`whitespace-nowrap pl-[0.05em] ${expansionTextFontSizeClasses} text-stac-expansion-text`}
                    >
                      {unit.expansion}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.div>
          ))}
        </motion.h1>
      </div>

      {/* IIT Mandi Section (ensure colors are also theme-aware) */}
      <motion.div
        className="relative mt-10 sm:mt-12 md:mt-16 -top-10"
        onMouseEnter={() => setIsIitHovered(true)}
        onMouseLeave={() => setIsIitHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: isStacHovered ? 0.6 : 0.8,
            duration: 0.6,
            ease: professionalEase,
          },
        }}
      >
        <motion.p
          className={`text-lg sm:text-xl md:text-2xl mb-0 cursor-pointer transition-all duration-500 ease-out`}
          animate={{
            scale: isIitHovered ? 1.1 : 1,
            textShadow: isIitHovered
              ? `0 0 15px hsl(var(--theme-primary)/0.7), 0 0 25px hsl(var(--theme-accent-1)/0.5)` // Using theme-accent-1 for the second shadow color
              : "none",
          }}
          transition={{ duration: 0.4, ease: professionalEase }}
        >
          <span
            className={
              isIitHovered
                // Gradient using theme colors. Consider if 'theme-secondary' makes sense here or another accent.
                ? "text-transparent bg-clip-text bg-gradient-to-r from-theme-primary via-theme-accent-1 to-theme-secondary"
                : "text-muted-foreground"
            }
          >
            IIT Mandi
          </span>
        </motion.p>

        {/* Nebula/Aura Glow behind IIT Mandi */}
        <AnimatePresence>
          {isIitHovered && (
            <motion.div
              className="absolute inset-[-20px] rounded-full -z-10"
              style={{
                background:
                  `radial-gradient(circle, hsl(var(--theme-primary)/0.3) 0%, hsl(var(--theme-accent-1)/0.1) 40%, hsla(var(--theme-accent-1)/0) 70%)`, // Using theme-accent-1
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
        
        <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10">
            <AnimatePresence>
            {isIitHovered &&
                iitStars.map((star) => (
                <Star
                    key={star.id}
                    delay={star.delay}
                    size={star.size}
                    top={star.top}
                    left={star.left}
                />
                ))}
            </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;