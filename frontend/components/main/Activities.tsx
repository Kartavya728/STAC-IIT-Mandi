// src/components/main/Activities.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import InfiniteImageSlider from '../sub/Infinity'; // Your updated slider
import { ClubActivity } from '@/app/page';

// ... (stripHtml function, SliderSlide interface, ActivitiesComponentProps) ...

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
  const isInView = useInView(componentRef, { once: false, amount: 0.2 });

  useEffect(() => {
    const updateVisibleSlides = () => {
      if (window.innerWidth < 768) { // Mobile
        setVisibleSlidesCount(3);
      } else { // Desktop/Laptop
        setVisibleSlidesCount(5);
      }
    };
    updateVisibleSlides();
    window.addEventListener('resize', updateVisibleSlides);
    return () => window.removeEventListener('resize', updateVisibleSlides);
  }, []);

  const slidesData: SliderSlide[] = activities.map(activity => ({
    id: activity.id,
    imageUrl: activity.image_url,
    title: activity.activity,
    description: stripHtml(activity.content),
    altText: activity.activity,
  }));

  if (!slidesData || slidesData.length === 0) {
    return null;
  }

  const componentVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const handleSliderItemClick = (slideId: string | number) => {
    console.log(`ActivitiesComponent: Slide ${slideId} was clicked and should be centered by InfiniteImageSlider.`);
    // The centering logic is now *inside* InfiniteImageSlider
  };

  return (
    <motion.div
      ref={componentRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={componentVariants}
      style={{
        minHeight: '80vh',
        paddingTop: '50px',
        paddingBottom: '50px',
        overflowX: 'hidden', // Prevent scroll from this component
      }}
      id="activities"
      className="w-full"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-16 text-white px-4">
        Club Activities
      </h2>
      <InfiniteImageSlider
        slides={slidesData}
        // slideDuration={4000} // Pass if your slider uses it
        visibleSlides={Math.min(visibleSlidesCount, slidesData.length)}
        onItemClick={handleSliderItemClick} // This prop should now be accepted
      />
    </motion.div>
  );
};

export default ActivitiesComponent;