// components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes"; // This import must work
import { useEffect, useState } from "react";
// You can use icons if you prefer
// import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder to avoid layout shift and hydration errors
    return <div className="w-8 h-8 sm:w-10 sm:h-10" />;
  }

  return (
    <button
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
      className="p-2 rounded-full transition-colors duration-200
                 text-foreground hover:bg-muted/50 focus:outline-none
                 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        // <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-xl sm:text-2xl" role="img" aria-label="Sun icon">☀️</span>
      ) : (
        // <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-xl sm:text-2xl" role="img" aria-label="Moon icon">🌙</span>
      )}
    </button>
  );
};

export default ThemeToggle;