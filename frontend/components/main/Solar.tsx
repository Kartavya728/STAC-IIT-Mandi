'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './SolarSystem.module.css';

// Interface and Data (solarSystemData) remain the same as previous version
interface PlanetInfo {
  id: string;
  name: string;
  info: string;
  image: string;

  isSun?: boolean;
  sunTop?: number; // em
  sunLeft?: number; // em
  sunSize?: number; // em // This size is for the .sun div (including glow area)

  orbitSize?: number; // em
  orbitTopLeft?: number; // em
  planetSize?: number; // em
  planetTop?: number; // em (relative to its orbit path)
  planetRight?: number; // em (relative to its orbit path)
  orbitDuration: number; // seconds for orbital revolution (0 for Sun)
  axisDuration?: number; // seconds for axial rotation (optional)

  moonData?: {
    id: string;
    name: string;
    info: string;
    image: string;
    orbitSize: number;
    orbitTop: number;
    orbitRight: number;
    planetSize: number;
    planetTop: number;
    planetRight: number;
    orbitDuration: number;
    axisDuration?: number;
  };
}

const solarSystemData: PlanetInfo[] = [
  { // The sunSize (10em) is for the .sun div which includes the glow. The image inside will be smaller.
    id: 'sun', name: 'Sun', isSun: true, info: 'Our solar system\'s star.',
    image: '/images/sun.png', sunSize: 10, sunTop: 15, sunLeft: 15, orbitDuration: 0,
  },
  {
    id: 'mercury', name: 'Mercury', info: 'Smallest planet, closest to Sun.',
    image: '/images/mercury.png', orbitSize: 15, orbitTopLeft: 12.5, planetSize: 1.2, planetTop: 1.2, planetRight: 0.5, orbitDuration: 8.7, axisDuration: 58.6
  },
  {
    id: 'venus', name: 'Venus', info: 'Earth\'s "sister planet", very hot.',
    image: '/images/venus.png', orbitSize: 20, orbitTopLeft: 10, planetSize: 1.8, planetTop: 1.8, planetRight: 1.8, orbitDuration: 22.4, axisDuration: -243
  },
  {
    id: 'earth', name: 'Earth', info: 'Our home, harbors life.',
    image: '/images/earth.png', orbitSize: 28, orbitTopLeft: 6, planetSize: 2, planetTop: 2.5, planetRight: 2.5, orbitDuration: 36.5, axisDuration: 1,
    moonData: {
      id: 'moon', name: 'Moon', info: 'Earth\'s natural satellite.', image: '/images/moon.png',
      orbitSize: 7, orbitTop: 1, orbitRight: -0.8,
      planetSize: 0.8, planetTop: 0.5, planetRight: 0.2,
      orbitDuration: 2.73, axisDuration: 27.3
    }
  },
  {
    id: 'mars', name: 'Mars', info: 'The "Red Planet", cold desert.',
    image: '/images/mars.png', orbitSize: 36, orbitTopLeft: 2, planetSize: 1.5, planetTop: 3, planetRight: 2, orbitDuration: 68.7, axisDuration: 1.03
  },
  {
    id: 'jupiter', name: 'Jupiter', info: 'Largest planet, gas giant.',
    image: '/images/jupiter.png', orbitSize: 45, orbitTopLeft: -2.5, planetSize: 4, planetTop: 4, planetRight: 3, orbitDuration: 12 * 3.65, axisDuration: 0.41
  },
  {
    id: 'saturn', name: 'Saturn', info: 'Gas giant with famous rings.',
    image: '/images/saturn.png', orbitSize: 55, orbitTopLeft: -7.5, planetSize: 3.5, planetTop: 5, planetRight: 4, orbitDuration: 29.5 * 3.65, axisDuration: 0.44
  },
  {
    id: 'uranus', name: 'Uranus', info: 'Ice giant, tilted on its side.',
    image: '/images/uranus.png', orbitSize: 65, orbitTopLeft: -12.5, planetSize: 3, planetTop: 6, planetRight: 5, orbitDuration: 84 * 3.65, axisDuration: -0.72
  },
  {
    id: 'neptune', name: 'Neptune', info: 'Farthest ice giant, deep blue.',
    image: '/images/neptune.png', orbitSize: 75, orbitTopLeft: -17.5, planetSize: 2.8, planetTop: 7, planetRight: 6, orbitDuration: 165 * 3.65, axisDuration: 0.67
  },
  {
    id: 'pluto', name: 'Pluto', info: 'Dwarf planet in Kuiper Belt.',
    image: '/images/pluto.png', orbitSize: 85, orbitTopLeft: -22.5, planetSize: 1, planetTop: 8, planetRight: 7, orbitDuration: 248 * 3.65, axisDuration: -6.39
  },
];

interface TooltipState {
  visible: boolean;
  contentHtml: string;
  x: number;
  y: number;
}

const SolarSystem: React.FC = () => {
  const scalingContextRef = useRef<HTMLDivElement>(null);
  const solarSystemViewportRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const emBaseFontSize = 650 / 85;

  useEffect(() => {
    const starContainer = scalingContextRef.current;
    if (!starContainer) return;
    // Star generation logic (no changes from previous correct version)
    const numStars = 150;
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement("div");
      star.className = styles.star;
      const size = Math.random() * 1.2 + 0.2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      const fadeInDelay = Math.random() * 2.5;
      const twinkleDelay = Math.random() * 5 + fadeInDelay;
      star.style.animation = `
        ${styles.fadeInStar} 1.5s ${fadeInDelay}s ease-out forwards,
        ${styles.twinkle} ${Math.random() * 4 + 3}s ${twinkleDelay}s linear infinite alternate
      `;
      starContainer.appendChild(star);
    }
    return () => {
      starContainer.querySelectorAll(`.${styles.star}`).forEach(s => s.remove());
    };
  }, []);

  const showTooltip = (
    event: React.MouseEvent<HTMLDivElement>,
    name: string,
    info: string
  ) => {
    if (!solarSystemViewportRef.current || !event.currentTarget) return; // Added check for event.currentTarget
    
    const bodyElement = event.currentTarget;
    const bodyRect = bodyElement.getBoundingClientRect();
    const viewportRect = solarSystemViewportRef.current.getBoundingClientRect();

    const xPos = (bodyRect.left - viewportRect.left) + (bodyRect.width / 2);
    const yPos = (bodyRect.top - viewportRect.top);

    setTooltip({
      visible: true,
      contentHtml: `<h3>${name}</h3><p>${info}</p>`,
      x: xPos,
      y: yPos,
    });
  };

  const hideTooltip = () => {
    setTooltip(prev => prev ? { ...prev, visible: false } : null);
    // Optional: setTimeout(() => setTooltip(null), 100);
  };

  const getAnimation = (duration?: number): React.CSSProperties => {
    if (duration && duration !== 0) {
      return { animation: `${styles.orbitAnimation} ${duration}s linear infinite` };
    }
    return {};
  };
  
  return (
    <div className={styles.solarSystemViewport} ref={solarSystemViewportRef}>
      <div
        className={styles.scalingContext}
        ref={scalingContextRef}
        style={{ fontSize: `${emBaseFontSize}px` }}
      >
        <div className={styles.container}> {/* This positions the Sun and planet orbits */}
          {solarSystemData.map((body) => {
            if (body.isSun) {
              return (
                <div // SUN DIV
                  key={body.id}
                  className={styles.sun}
                  style={{
                    top: `${body.sunTop}em`,
                    left: `${body.sunLeft}em`,
                    width: `${body.sunSize}em`,
                    height: `${body.sunSize}em`,
                  }}
                  onMouseEnter={(e) => showTooltip(e, body.name, body.info)}
                  onMouseLeave={hideTooltip}
                >
                  {/* Image is styled via CSS to be smaller than this div */}
                  <Image src={body.image} alt={body.name} layout="fill" objectFit="none" /> 
                  {/*
                    Using layout="fill" and objectFit="none" for the sun image,
                    and then styling its size with width/height in .sun img CSS
                    gives more control if the image asset has whitespace.
                    Alternatively, keep width/height on Image and ensure .sun img CSS handles it.
                    For simplicity of CSS driving image size within .sun:
                  */}
                   {/* <img src={body.image} alt={body.name} /> // Simpler if CSS .sun img handles size */}
                </div>
              );
            }

            // PLANETS
            return (
              <div // ORBIT PATH DIV for Planet
                key={body.id}
                className={`${styles.orbit} ${styles[body.id + 'Orbit' as keyof typeof styles] || styles.earthOrbit }`}
                style={{
                  width: `${body.orbitSize}em`,
                  height: `${body.orbitSize}em`,
                  top: `${body.orbitTopLeft}em`,
                  left: `${body.orbitTopLeft}em`,
                  ...getAnimation(body.orbitDuration)
                }}
              >
                {/* CELESTIAL BODY DIV for Planet - THIS IS THE HOVER TARGET */}
                <div
                  className={styles.celestialBody}
                  style={{
                    width: `${body.planetSize}em`,
                    height: `${body.planetSize}em`,
                    top: `${body.planetTop}em`,
                    right: `${body.planetRight}em`,
                    backgroundImage: `url(${body.image})`,
                    ...getAnimation(body.axisDuration)
                  }}
                  onMouseEnter={(e) => showTooltip(e, body.name, body.info)}
                  onMouseLeave={hideTooltip}
                />

                {body.moonData && (
                  <div // ORBIT PATH DIV for Moon
                    key={body.moonData.id}
                    className={`${styles.orbit} ${styles.moonOrbit}`}
                    style={{
                      width: `${body.moonData.orbitSize}em`,
                      height: `${body.moonData.orbitSize}em`,
                      top: `${body.moonData.orbitTop}em`,
                      right: `${body.moonData.orbitRight}em`,
                      ...getAnimation(body.moonData.orbitDuration)
                    }}
                  >
                    {/* CELESTIAL BODY DIV for Moon - THIS IS THE HOVER TARGET */}
                    <div
                      className={styles.celestialBody}
                      style={{
                        width: `${body.moonData.planetSize}em`,
                        height: `${body.moonData.planetSize}em`,
                        top: `${body.moonData.planetTop}em`,
                        right: `${body.moonData.planetRight}em`,
                        backgroundImage: `url(${body.moonData.image})`,
                        ...getAnimation(body.moonData.axisDuration)
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        showTooltip(e, body.moonData!.name, body.moonData!.info);
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        hideTooltip();
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {tooltip && tooltip.visible && ( /* Ensure tooltip is only rendered if visible flag is also true */
        <div
          className={`${styles.popupTooltip} ${styles.visible}`} /* Always add visible class if rendered */
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.contentHtml }}
        />
      )}
    </div>
  );
};

export default SolarSystem;