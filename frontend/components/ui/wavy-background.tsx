"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 0,
  speed = "medium",
  waveOpacity = 0.7,
  numberOfWaves = 3,
  amplitude = 60, // This will be the STEADY-STATE amplitude
  wavelength = 600,
  initialSpreadDuration = 1000, // Duration of the initial spread in milliseconds
  initialAmplitudeFactor = 0.3, // e.g., 1.5 means initial max amplitude is 1.5x steady-state
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "medium" | "fast";
  waveOpacity?: number;
  numberOfWaves?: number;
  amplitude?: number; // Steady-state amplitude
  wavelength?: number;
  initialSpreadDuration?: number;
  initialAmplitudeFactor?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null); // To track animation start time

  let w: number, h: number, nt: number, ctx: CanvasRenderingContext2D | null, animationId: number;

  const getSpeed = () => {
    // ... (speed logic remains the same)
    switch (speed) {
      case "slow":
        return 0.0015;
      case "medium":
        return 0.003;
      case "fast":
        return 0.006;
      default:
        return 0.003;
    }
  };

  const initAnimation = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    w = canvas.width = container.offsetWidth;
    h = canvas.height = container.offsetHeight;

    if (blur > 0) {
      ctx.filter = `blur(${blur}px)`;
    } else {
      ctx.filter = 'none';
    }
    nt = 0;
    startTimeRef.current = performance.now(); // Record start time for dynamic amplitude

    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    renderAnimation();
  };

  const defaultWaveColors = [
    "#FF4500", "#FF8C00", "#FFA500", "#FFD700",
  ];
  const currentWaveColors = colors ?? defaultWaveColors;

  const drawWave = (numWaves: number) => {
    if (!ctx || w === 0 || h === 0 || !startTimeRef.current) return;
    nt += getSpeed();
    const effectiveWaveWidth = waveWidth || 2;

    // --- Dynamic Amplitude Logic ---
    const elapsedTime = performance.now() - startTimeRef.current;
    let currentAmplitudeFactor = 1;

    if (elapsedTime < initialSpreadDuration) {
      // Easing function for smooth transition: starts high, settles to 1
      // This is a simple linear interpolation, could be an ease-out function for smoother feel
      const progress = elapsedTime / initialSpreadDuration; // 0 to 1
      currentAmplitudeFactor = initialAmplitudeFactor - (initialAmplitudeFactor - 1) * progress;
    } else {
      currentAmplitudeFactor = 1; // Steady state
    }

    const dynamicAmplitude = amplitude * currentAmplitudeFactor;
    const effectiveAmplitude = Math.min(dynamicAmplitude, h * 0.45); // Cap overall amplitude
    // --- End Dynamic Amplitude Logic ---


    for (let i = 0; i < numWaves; i++) {
      ctx.beginPath();
      ctx.lineWidth = effectiveWaveWidth;
      ctx.strokeStyle = currentWaveColors[i % currentWaveColors.length];

      for (let xPos = 0; xPos < w; xPos += 5) {
        const noiseX = wavelength > 0 ? xPos / wavelength : xPos;
        var yPos = noise(noiseX, 0.2 * i + i * 0.05 + 0.1, nt) * effectiveAmplitude;
        ctx.lineTo(xPos, yPos + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  const renderAnimation = () => {
    if (!ctx) return;
    ctx.globalAlpha = 1;
    ctx.fillStyle = backgroundFill || "transparent";
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = waveOpacity;
    drawWave(numberOfWaves);
    animationId = requestAnimationFrame(renderAnimation);
  };

  useEffect(() => {
    // ... (useEffect logic remains largely the same)
    let debounceTimeout: NodeJS.Timeout;
    const debouncedInit = () => {
        clearTimeout(debounceTimeout);
        if (canvasRef.current && containerRef.current) {
             initAnimation();
        }
    };
    // Debounce initial call slightly to allow layout to settle
    debounceTimeout = setTimeout(debouncedInit, 100);


    const handleResize = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        if (canvasRef.current && containerRef.current) {
            // On resize, restart the spread animation
            startTimeRef.current = null; // Reset start time so initAnimation sets it fresh
            initAnimation();
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(debounceTimeout);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (ctx && w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h);
      }
    };
  }, [ // Add new props to dependencies
    blur, speed, waveOpacity, backgroundFill, colors, waveWidth,
    numberOfWaves, amplitude, wavelength,
    initialSpreadDuration, initialAmplitudeFactor
  ]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn("relative flex flex-col items-center justify-center overflow-hidden", containerClassName)}
      ref={containerRef}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari && blur > 0 ? { filter: `blur(${blur}px)` } : {}),
          willChange: blur > 0 ? 'filter' : 'auto',
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};