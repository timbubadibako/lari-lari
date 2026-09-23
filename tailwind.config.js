const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Midnight Sapphire specific colors
        sapphire: {
          400: '#38bdf8',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
        midnight: {
          900: '#010413',
          800: '#020617',
          700: '#0f172a',
        },
        emerald: {
          500: '#10b981',
        },
        crimson: {
          500: '#ef4444',
        },
        platinum: {
          100: '#f1f5f9',
          300: '#cbd5e1',
          500: '#64748b',
        }
      },
      spacing: {
        "unit": "8px",
        "gutter": "16px",
        "margin-desktop": "32px",
        "margin-mobile": "16px"
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      fontFamily: {
        serif: ["DMSerifDisplay-Regular"],
        sans: ["Poppins-Regular"],
        sansMedium: ["Poppins-Medium"],
        sansBold: ["Poppins-Bold"],
        mono: ["JetBrainsMono"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
