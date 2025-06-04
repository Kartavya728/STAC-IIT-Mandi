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
        // --- Your HSL-based theme structure (references CSS variables) ---
        'theme-primary': 'hsl(var(--theme-primary))',
        'theme-secondary': 'hsl(var(--theme-secondary))',
        'theme-accent-1': 'hsl(var(--theme-accent-1))', // #ffdc9b
        // ...
        'stac-expansion-text': 'hsl(var(--stac-expansion-text-color))', // New color for STAC expansion
        // ...
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
          DEFAULT: 'hsl(var(--primary))', // This will be our main orange
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
          DEFAULT: 'hsl(var(--accent))', // This will be one of your accent yellows/oranges
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // chart colors can remain as they are or be themed too
        chart: { /* ... your existing chart colors ... */ },

        // --- Add your specific desired theme colors by name ---
        'theme-orange-start': '#F97316', // approx orange-500 (Tailwind)
        'theme-yellow-end': '#F59E0B',   // approx yellow-500 (Tailwind)
        'theme-accent-light': '#ffdc9b',
        'theme-accent-medium': '#f89442',
        'theme-accent-medium-alpha': '#f894428b', // with alpha

        // You can define dark mode variants directly here if needed for specific overrides
        // e.g., 'theme-orange-start-dark': '#EA580C',
      },
      backgroundImage: {
        'theme-gradient': 'linear-gradient(to right, var(--gradient-color-start), var(--gradient-color-end))',
        // If you want a slightly different gradient for dark mode, define another one
        // 'theme-gradient-dark': 'linear-gradient(to right, var(--gradient-color-start-dark), var(--gradient-color-end-dark))',
      },
      borderRadius: { /* ... your existing ... */ },
      animation: {
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
        // These will now use the themed --primary and --accent HSL values from globals.css
        'themed-glow-primary': '0 0 25px -5px hsl(var(--primary) / 0.5), 0 0 10px -5px hsl(var(--primary) / 0.3)',
        'themed-glow-accent': '0 0 25px -5px hsl(var(--accent) / 0.5), 0 0 10px -5px hsl(var(--accent) / 0.3)',
        'themed-glow-subtle': [
          '0px 10px 25px -8px hsl(var(--primary) / 0.2)',
          '0px 6px 15px -10px hsl(var(--accent) / 0.15)',
        ].join(', '),
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
export default config;