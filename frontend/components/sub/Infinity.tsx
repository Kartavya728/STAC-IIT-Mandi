// components/sub/Infinity.tsx (or your path to InfiniteImageSlider.tsx)
"use client";

import React, { useState, useEffect, useCallback, CSSProperties, useRef } from 'react';

interface Slide {
  id: string | number;
  imageUrl: string;
  title?: string;
  description?: string;
  altText?: string;
}

export interface InfiniteImageSliderProps {
  slides: Slide[];
  slideDuration?: number;
  visibleSlides?: number;
  onItemClick?: (id: string | number) => void;
}

const InfiniteImageSlider: React.FC<InfiniteImageSliderProps> = ({
  slides,
  slideDuration = 3500,
  visibleSlides = 3,
  onItemClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClickTransition, setIsClickTransition] = useState(false);
  const numSlides = slides.length;
  const clickTransitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const normalTransitionDuration = 1000; // Normal animation duration
  const instantTransitionDuration = 50; // For "instant" click

  const changeSlide = useCallback((newIndex: number, isClicked: boolean = false) => {
    if (isClicked) {
      setIsClickTransition(true);
      setCurrentIndex(newIndex);
      if (clickTransitionTimeoutRef.current) clearTimeout(clickTransitionTimeoutRef.current);
      clickTransitionTimeoutRef.current = setTimeout(() => {
        setIsClickTransition(false);
      }, instantTransitionDuration + 50);
    } else {
      setIsClickTransition(false);
      setCurrentIndex(newIndex);
    }
  }, []);

  const nextSlide = useCallback(() => {
    changeSlide((currentIndex + 1) % numSlides);
  }, [numSlides, currentIndex, changeSlide]);

  useEffect(() => {
    if (numSlides <= 1 || !slideDuration) return;
    const timer = setInterval(nextSlide, slideDuration);
    return () => {
      clearInterval(timer);
      if (clickTransitionTimeoutRef.current) clearTimeout(clickTransitionTimeoutRef.current);
    };
  }, [slideDuration, nextSlide, numSlides]);

  const handleSlideClick = (slideId: string | number, index: number) => {
    changeSlide(index, true);
    if (onItemClick) onItemClick(slideId);
  };

  if (!slides || numSlides === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-500">No slides to display.</div>;
  }

  const actualVisibleSlides = visibleSlides % 2 === 0 ? (visibleSlides > 0 ? visibleSlides - 1 : 3) : visibleSlides;

  const getItemStyle = (index: number): CSSProperties => {
    let offset = index - currentIndex;
    if (numSlides > 1) {
      const half = Math.floor(numSlides / 2);
      if (offset > half) offset -= numSlides;
      else if (offset < -half) offset += numSlides;
    }

    const baseCenteringTransform = 'translate(-50%, -50%)';
    let dynamicTransforms = '';
    let opacity = 0;
    let zIndex = 0;
    let filter = 'blur(4px)';

    const isCenter = offset === 0;
    const isImmediateSide = Math.abs(offset) === 1;
    const isOuterVisibleSideForFiveView = actualVisibleSlides === 5 && Math.abs(offset) === 2;

    // Original center scale was ~1.05. 1.5x of that is ~1.575. Let's try 1.5 or 1.6.
    const centerScale = 1.5; // Significantly larger center image

    if (isCenter) {
      dynamicTransforms = `scale(${centerScale}) translateX(0%) translateZ(50px) rotateY(0deg)`; // Added small translateZ to bring it forward
      opacity = 1;
      zIndex = numSlides + 2; // Higher z-index
      filter = 'blur(0px)';
    } else if (isImmediateSide) {
      const sideDirection = Math.sign(offset);
      opacity = 1;
      zIndex = numSlides;
      filter = 'blur(1px)';
      // Need to push side images further out to accommodate larger center image
      if (actualVisibleSlides === 3) { // Mobile: 3-slide view
        // Pushing them further, scale down a bit more
        dynamicTransforms = `scale(0.75) translateX(${sideDirection * 110}%) translateZ(-180px) rotateY(${-sideDirection * 25}deg)`;
      } else { // Laptop: 5-slide view (offset +/-1)
        // Pushing them further, scale down a bit more
        dynamicTransforms = `scale(0.8) translateX(${sideDirection * 95}%) translateZ(-150px) rotateY(${-sideDirection * 22}deg)`;
      }
    } else if (isOuterVisibleSideForFiveView) { // Laptop: 5-slide view, "half-out" items (offset +/-2)
      const sideDirection = Math.sign(offset);
      // These also need to be pushed further out
      dynamicTransforms = `scale(0.7) translateX(${sideDirection * 170}%) translateZ(-280px) rotateY(${-sideDirection * 35}deg)`;
      opacity = 0.6; // Keep opacity reasonable for "half-out"
      zIndex = numSlides - 1;
      filter = 'blur(3px)';
    } else { // Far out slides
      const sideDirection = Math.sign(offset) || 1;
      dynamicTransforms = `scale(0.5) translateX(${sideDirection * 250}%) translateZ(-400px) rotateY(${-sideDirection * 45}deg)`;
      opacity = 0;
      zIndex = 0;
      filter = 'blur(5px)';
    }

    return {
      transform: `${baseCenteringTransform} ${dynamicTransforms}`,
      opacity: opacity,
      zIndex: zIndex,
      filter: filter,
      pointerEvents: opacity < 0.1 ? 'none' : 'auto',
      transitionDuration: isClickTransition ? `${instantTransitionDuration}ms` : `${normalTransitionDuration}ms`,
      transitionProperty: 'all',
      transitionTimingFunction: isClickTransition ? 'linear' : 'cubic-bezier(0.35,0,0.25,1)',
    };
  };

  const gradientBorderOuterClasses = "p-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl shadow-lg cursor-pointer";
  const innerContentBgClasses = "bg-neutral-800 rounded-[calc(0.75rem-4px)] w-full h-full overflow-hidden flex flex-col items-center justify-center relative";

  // Slide dimensions remain the same; the scaling will make the center one appear larger.
  // If these base dimensions are too small for a 1.5x scaled center image to look good,
  // you might need to increase these base dimensions slightly.
  const slideDimensionClasses = `
    w-[280px] h-[160px] 
    sm:w-[300px] sm:h-[170px] 
    md:w-[380px] md:h-[215px] 
    lg:w-[450px] lg:h-[255px] 
  `;

  // Viewport height might need to be increased if the 1.5x scaled center image is too tall.
  // Original: h-[450px] sm:h-[480px] md:h-[500px] lg:h-[520px]
  // Let's try increasing it slightly.
  const viewportHeightClasses = "h-[480px] sm:h-[500px] md:h-[530px] lg:h-[560px]";


  return (
    <div className="flex flex-col items-center justify-center w-full box-border bg-transparent">
      <div className={`relative w-full max-w-5xl md:max-w-6xl xl:max-w-7xl flex items-center justify-center overflow-hidden ${viewportHeightClasses}`}>
        <div
          className="relative w-full h-full"
          style={{ perspective: '2000px', perspectiveOrigin: '50% 50%', transformStyle: 'preserve-3d' }}
        >
          {slides.map((slide, index) => {
            const isCenterSlide = index === currentIndex;
            const itemStyle = getItemStyle(index);

            return (
              <div
                key={slide.id}
                className={`
                  absolute top-1/2 left-1/2 
                  transform-gpu
                  ${slideDimensionClasses}
                  ${gradientBorderOuterClasses}
                `}
                style={itemStyle}
                onClick={() => handleSlideClick(slide.id, index)}
                role="button"
                tabIndex={isCenterSlide ? 0 : -1}
                aria-label={slide.title || `View slide ${index + 1}`}
              >
                <div className={innerContentBgClasses}>
                  <img
                    src={slide.imageUrl}
                    alt={slide.altText || `Image for ${slide.title || 'slide ' + (index + 1)}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Text overlay will be scaled with the parent due to transform. Font sizes might need adjustment if text becomes too large. */}
                  <div className={`
                      absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 
                      bg-black/40  
                      transition-opacity duration-700 ease-in-out 
                      ${isCenterSlide ? 'opacity-100 delay-300' : 'opacity-0'} 
                  `}>
                    {slide.title && (
                      <h2 className={`
                        text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-1 sm:mb-2
                        transition-all duration-500 ease-out
                        ${isCenterSlide ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-5'}
                        text-shadow drop-shadow-lg
                      `}>
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <p className={`
                        text-xs sm:text-sm text-neutral-200 text-center max-w-xs 
                        line-clamp-2 sm:line-clamp-3 
                        transition-all duration-500 ease-out
                        ${isCenterSlide ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-5'}
                        text-shadow-sm drop-shadow-md
                      `}>
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InfiniteImageSlider;