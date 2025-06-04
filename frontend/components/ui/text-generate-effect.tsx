"use client";
import { useEffect } from "react";
// Ensure this import is correct for your setup (Framer Motion or Motion One)
import { motion, stagger, useAnimate } from "framer-motion"; // OR "motion/react"
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate(); // Re-introduce
  if (!words || words.trim() === "") {
    console.error("TextGenerateEffect: 'words' prop is empty or undefined in animate step!");
    return <div style={{ color: "red" }}>Error: No words provided (animate).</div>;
  }
  let wordsArray = words.split(" ");

  useEffect(() => {
    console.log("TextGenerateEffect: useEffect triggered. Words:", words, "Filter:", filter, "Duration:", duration);
    if (scope.current) {
      console.log("TextGenerateEffect: Scope is present. Animating spans...");
      // The 'animate' function from useAnimate is stable, so it doesn't strictly need to be in deps
      // if its identity never changes. However, including it is safer.
      // The key is that the effect re-runs if 'words', 'filter', or 'duration' change.
      const animation = animate( // Capture the promise/controls
        "span", // Target span elements within the scope
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration, // Use the prop
          delay: stagger(0.2),
        }
      );

      // For debugging animation completion/error
      if (animation && typeof animation.then === 'function') {
        animation.then(() => {
          console.log("TextGenerateEffect: Animation promise resolved (completed).");
        }).catch(error => {
          console.error("TextGenerateEffect: Animation promise rejected.", error);
        });
      } else {
        // If animate returns controls (like in older Framer Motion or different setup)
        // This part might not be directly applicable to motion/react's useAnimate
        console.log("TextGenerateEffect: animate() did not return a promise. Animation might be fire-and-forget or uses controls object.");
      }

    } else {
      console.warn("TextGenerateEffect: scope.current is null or undefined in useEffect. Animation cannot run.");
    }
    // Ensure dependencies are correct for re-running animation when props change.
  }, [animate, words, filter, duration, scope]); // Added scope to deps too, though animate should cover its readiness.

  const renderWords = () => {
    return (
      <motion.div ref={scope}> {/* Re-introduce ref */}
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-white text-black opacity-0" // Initial styles
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};