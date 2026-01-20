import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Clicon Primary - Orange
        primary: {
          50: '#FFF7F0',
          100: '#FFEDD9',
          200: '#FFDBB3',
          300: '#FFC98D',
          400: '#FFB366',
          500: '#FA8232', // Main brand orange
          600: '#E5700F',
          700: '#C45E0A',
          800: '#9C4B08',
          900: '#7A3B06',
          950: '#4D2504',
        },
        // Secondary - Dark Navy
        secondary: {
          50: '#F0F3FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#2DA5F3', // Accent blue
          600: '#1B8FDB',
          700: '#1572B6',
          800: '#1E3A8A',
          900: '#191C1F', // Dark navy (footer/header bg)
          950: '#0D0E10',
        },
        // Neutral grays
        gray: {
          50: '#F2F4F5',
          100: '#E4E7E9',
          200: '#C9CFD2',
          300: '#AEB8BC',
          400: '#929FA5',
          500: '#77878F',
          600: '#5F6C72',
          700: '#475156',
          800: '#303639',
          900: '#191C1F',
          950: '#0D0E10',
        },
        // Semantic colors
        success: {
          50: '#E6F9EE',
          100: '#CCF3DD',
          200: '#99E7BB',
          300: '#66DB99',
          400: '#33CF77',
          500: '#2DB224', // Success green
          600: '#248F1D',
          700: '#1B6B16',
          800: '#12470E',
          900: '#092407',
        },
        warning: {
          50: '#FFF8E6',
          100: '#FFF1CC',
          200: '#FFE399',
          300: '#FFD566',
          400: '#FFC633',
          500: '#EBC80C', // Warning yellow
          600: '#BCA00A',
          700: '#8D7807',
          800: '#5E5005',
          900: '#2F2802',
        },
        danger: {
          50: '#FEECEB',
          100: '#FDD9D7',
          200: '#FBB3AF',
          300: '#F98D87',
          400: '#F7675F',
          500: '#EE5858', // Danger red
          600: '#BE4646',
          700: '#8F3535',
          800: '#5F2323',
          900: '#301212',
        },
      },
      fontFamily: {
        sans: ['var(--font-public-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'header': '0 1px 3px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'card': '4px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
