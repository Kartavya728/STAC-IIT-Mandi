// src/components/main/Activities.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import InfiniteImageSlider from '../sub/Infinity';
import { ClubActivity } from '@/app/page';

const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>?/gm, '');
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

interface SliderSlide {
  id: number | string;
  imageUrl: string;
  title: string;
  description: string;
  altText: string;
}

interface ActivitiesComponentProps {
  activities: ClubActivity[];
}

const ActivitiesComponent: React.FC<ActivitiesComponentProps> = ({ activities }) => {
  const [visibleSlidesCount, setVisibleSlidesCount] = useState(5);
  const componentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(componentRef, { once: false, amount: 0.1 });

  useEffect(() => {
    const updateVisibleSlides = () => {
      if (window.innerWidth < 768) {
        setVisibleSlidesCount(3);
      } else if (window.innerWidth < 1024) {
        setVisibleSlidesCount(4);
      } else {
        setVisibleSlidesCount(5);
      }
    };
    updateVisibleSlides();
    window.addEventListener('resize', updateVisibleSlides);
    return () => window.removeEventListener('resize', updateVisibleSlides);
  }, []);

  const slidesData: SliderSlide[] = (activities || []).map(activity => ({
    id: activity.id,
    imageUrl: activity.image_url,
    title: activity.activity,
    description: stripHtml(activity.content).substring(0, 120) + (stripHtml(activity.content).length > 120 ? "..." : ""),
    altText: activity.activity,
  }));

  if (!activities || activities.length === 0) {
    return (
      <section id="activities" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center text-theme-text-subtle">
        Loading activities or no activities to display...
      </section>
    );
  }
  if (slidesData.length === 0) {
     return (
      <section id="activities" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center text-theme-text-subtle">
        No slides data available.
      </section>
    );
  }

  const componentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const handleSliderItemClick = (slideId: string | number) => {
    console.log(`ActivitiesComponent: Slide ${slideId} was clicked.`);
  };

  return (
    <motion.section
      ref={componentRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={componentVariants}
      id="activities"
      // Using the more moderate padding from the previous visibility fix step.
      className="w-full overflow-x-hidden
                relatiive top-5
                 py-16 md:py-20 lg:py-24 xl:py-28
                 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20
                 bg-theme-background" // Ensuring it has a background
    >
      {/* Title with FIXED GRADIENT COLOR */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-16">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
          What We Do
        </span>
        {/* FIXED COLOR for the rest of the title. */}
        <span className="text-neutral-900 dark:text-white"> As a Club?</span>
      </h2>

      <div className="relative -top-20">
        <InfiniteImageSlider
          slides={slidesData}
          visibleSlides={Math.min(visibleSlidesCount, slidesData.length)}
          onItemClick={handleSliderItemClick}
          // REMINDER: Image border (3px) needs to be applied INSIDE InfiniteImageSlider.tsx
        />
      </div>
    </motion.section>
  );
};

export default ActivitiesComponent;