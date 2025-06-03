// tailwind.config.js or tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: { /* ... your existing ... */ },
      borderRadius: { /* ... your existing ... */ },
      colors: { // Your existing theme colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))', // Will be used with transparency
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: { /* ... */ },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: { /* ... */ },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: { /* ... */ },
        border: 'hsl(var(--border))', // For card border
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: { /* ... */ }
      },
      animation: {
        // Original meteor effect from your first code block
        "meteor-effect": "meteor var(--meteor-duration, 5s) linear infinite",
      },
      keyframes: {
                meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      },
      boxShadow: {
        'themed-glow-primary': '0 0 25px -5px hsl(var(--primary) / 0.5), 0 0 10px -5px hsl(var(--primary) / 0.3)',
        'themed-glow-accent': '0 0 25px -5px hsl(var(--accent) / 0.5), 0 0 10px -5px hsl(var(--accent) / 0.3)',
        'themed-glow-subtle': [ // For general card hover
          '0px 10px 25px -8px hsl(var(--primary) / 0.2)',
          '0px 6px 15px -10px hsl(var(--accent) / 0.15)',
        ].join(', '),
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
export default config