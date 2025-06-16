// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'], // Correct for next-themes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Your existing color structure is perfect, no changes needed here ---
        'theme-primary': 'hsl(var(--theme-primary))',
        'theme-secondary': 'hsl(var(--theme-secondary))',
        'theme-accent-1': 'hsl(var(--theme-accent-1))',
        'stac-expansion-text': 'hsl(var(--stac-expansion-text-color))',
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))', // Main theme color (orange)
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', // Accent theme color (yellow)
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))', // Ring color for focus states
        chart: { /* ... */ },
        'theme-orange-start': '#F97316',
        'theme-yellow-end': '#F59E0B',
        'theme-accent-light': '#ffdc9b',
        'theme-accent-medium': '#f89442',
        'theme-accent-medium-alpha': '#f894428b',
      },
      backgroundImage: {
        'theme-gradient': 'linear-gradient(to right, var(--gradient-color-start), var(--gradient-color-end))',
      },
      borderRadius: { /* ... */ },
      // --- UPDATED ANIMATION & KEYFRAMES SECTION ---
      keyframes: {
        // Your existing meteor animation
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // ADDED: Keyframes for notification toast
        'slide-in-from-right': {
          '0%': { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-to-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(120%)', opacity: '0' },
        },
        'progress-bar-shrink': {
          'from': { width: '100%' },
          'to': { width: '0%' },
        },
      },
      animation: {
        // Your existing meteor animation
        "meteor-effect": "meteor var(--meteor-duration, 5s) linear infinite",
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        // ADDED: Class names for toast animations
        'slide-in': 'slide-in-from-right 400ms cubic-bezier(0.21, 1.02, 0.73, 1) both',
        'slide-out': 'slide-out-to-right 400ms cubic-bezier(0.25, 0.25, 0, 1.01) both',
        'progress-shrink': `progress-bar-shrink 7000ms linear forwards`,
      },
      boxShadow: { /* ... your existing shadow config ... */ }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
export default config