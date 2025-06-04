// components/sub/Infinity.tsx
"use client";

import React, { useState, useEffect, useCallback, CSSProperties } from 'react'; // Removed useRef as it's not used after changes

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
  borderColorClass?: string; // New prop for customizable border color
}

const InfiniteImageSlider: React.FC<InfiniteImageSliderProps> = ({
  slides,
  slideDuration = 3500,
  visibleSlides = 3,
  onItemClick,
  borderColorClass = "border-theme-primary", // Default to theme-primary
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const numSlides = slides.length;

  const transitionDurationMs = 700;

  const changeSlide = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
  }, []);

  const nextSlide = useCallback(() => {
    changeSlide((currentIndex + 1) % numSlides);
  }, [numSlides, currentIndex, changeSlide]);

  useEffect(() => {
    if (numSlides <= 1 || !slideDuration) return;
    const timer = setInterval(nextSlide, slideDuration);
    return () => {
      clearInterval(timer);
    };
  }, [slideDuration, nextSlide, numSlides]);

  const handleSlideClick = (slideId: string | number, index: number) => {
    changeSlide(index);
    if (onItemClick) onItemClick(slideId);
  };

  if (!slides || numSlides === 0) {
    return <div className="flex items-center justify-center h-64 text-theme-text-subtle">No slides to display.</div>;
  }

  const actualVisibleSlides = (visibleSlides > 0 && visibleSlides % 2 !== 0) ? visibleSlides : (visibleSlides > 1 && visibleSlides % 2 === 0 ? visibleSlides -1 : 3) ;

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
    const isOuterVisibleSide = actualVisibleSlides >= 5 && Math.abs(offset) === 2;
    const isEvenFurtherVisibleSide = actualVisibleSlides >= 7 && Math.abs(offset) === 3;

    const centerScale = 1.5; 

    if (isCenter) {
      dynamicTransforms = `scale(${centerScale}) translateX(0%) translateZ(60px) rotateY(0deg)`;
      opacity = 1;
      zIndex = numSlides + 2;
      filter = 'blur(0px)';
    } else if (isImmediateSide) {
      const sideDirection = Math.sign(offset);
      opacity = 1;
      zIndex = numSlides;
      filter = 'blur(1px)';
      if (actualVisibleSlides === 3) {
        dynamicTransforms = `scale(0.75) translateX(${sideDirection * 110}%) translateZ(-180px) rotateY(${-sideDirection * 25}deg)`;
      } else {
        dynamicTransforms = `scale(0.8) translateX(${sideDirection * 95}%) translateZ(-150px) rotateY(${-sideDirection * 22}deg)`;
      }
    } else if (isOuterVisibleSide) {
      const sideDirection = Math.sign(offset);
      dynamicTransforms = `scale(0.7) translateX(${sideDirection * 170}%) translateZ(-280px) rotateY(${-sideDirection * 35}deg)`;
      opacity = 0.7;
      zIndex = numSlides - 1;
      filter = 'blur(2px)';
    } else if (isEvenFurtherVisibleSide) {
       const sideDirection = Math.sign(offset);
       dynamicTransforms = `scale(0.6) translateX(${sideDirection * 230}%) translateZ(-380px) rotateY(${-sideDirection * 40}deg)`;
       opacity = 0.4;
       zIndex = numSlides - 2;
       filter = 'blur(3px)';
    } else {
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
      transition: `all ${transitionDurationMs}ms cubic-bezier(0.35, 0, 0.25, 1)`,
    };
  };

  const slideItemBaseClasses = `
    cursor-pointer shadow-xl overflow-hidden rounded-xl // Keep rounded corners for the item
    ${borderColorClass} border-[2px] // THEME COLOR BORDER of 10px
  `;

  const slideDimensionClasses = `
    w-[280px] h-[160px]
    sm:w-[300px] sm:h-[170px]
    md:w-[380px] md:h-[215px]
    lg:w-[450px] lg:h-[255px]
  `;

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
              // This is now the main slide item that gets the border and transformations
              <div
                key={slide.id}
                className={`
                  absolute top-1/2 left-1/2
                  transform-gpu
                  bg-theme-background // Add a background to prevent content behind from showing through border gaps
                  ${slideDimensionClasses}
                  ${slideItemBaseClasses} // Apply border and base styles here
                `}
                style={itemStyle}
                onClick={() => handleSlideClick(slide.id, index)}
                role="button"
                tabIndex={isCenterSlide ? 0 : -1}
                aria-label={slide.title || `View slide ${index + 1}`}
              >
                {/* Image fills the bordered container */}
                <img
                  src={slide.imageUrl}
                  alt={slide.altText || `Image for ${slide.title || 'slide ' + (index + 1)}`}
                  className="absolute inset-0 w-full h-full object-cover" // Image itself doesn't need border or rounding now
                />
                {/* Text overlay remains the same */}
                <div className={`
                    absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4
                    bg-black/50 dark:bg-black/60
                    transition-opacity duration-700 ease-in-out
                    ${isCenterSlide ? 'opacity-100 delay-300' : 'opacity-0'}
                `}>
                  {slide.title && (
                    <h2 className={`
                      text-lg sm:text-xl md:text-2xl font-bold text-white text-center mb-1 sm:mb-2
                      transition-all duration-500 ease-out
                      ${isCenterSlide ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-5'}
                      [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]
                    `}>
                      {slide.title}
                    </h2>
                  )}
                  {slide.description && (
                    <p className={`
                      text-xs sm:text-sm text-gray-200 dark:text-gray-300 text-center max-w-xs
                      line-clamp-2 sm:line-clamp-3
                      transition-all duration-500 ease-out
                      ${isCenterSlide ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-5'}
                      [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]
                    `}>
                      {slide.description}
                    </p>
                  )}
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