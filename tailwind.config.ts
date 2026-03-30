import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // MD3 Primary — forest green
        primary: {
          DEFAULT: '#4a6741',
          container: '#cbeac0',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          container: '#062100',
        },
        // MD3 Secondary — muted sage
        secondary: {
          DEFAULT: '#54634e',
          container: '#d7e8ce',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#121f0e',
        },
        // MD3 Tertiary — warm stone
        tertiary: {
          DEFAULT: '#386568',
          container: '#bcebee',
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#002022',
        },
        // MD3 Error
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#410002',
        },
        // MD3 Background & Surface
        background: '#faf9f5',
        'on-background': '#1a1c19',
        surface: {
          DEFAULT: '#faf9f5',
          variant: '#dde5d8',
          container: {
            DEFAULT: '#eef0ea',
            lowest: '#ffffff',
            low: '#f4f6ef',
            high: '#e8ebe4',
            highest: '#e3e5de',
          },
        },
        'on-surface': {
          DEFAULT: '#30332f',
          variant: '#5d605b',
        },
        // MD3 Outline
        outline: {
          DEFAULT: '#8d9387',
          variant: '#c1c9bb',
        },
        // MD3 Inverse
        'inverse-surface': '#2f312d',
        'inverse-on-surface': '#f0f2ec',
        'inverse-primary': '#afd4a5',
      },
      fontFamily: {
        headline: ['var(--font-headline)', 'sans-serif'],
        body: ['var(--font-body-jp)', 'var(--font-label)', 'sans-serif'],
        label: ['var(--font-label)', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'elevation-2': '0 2px 6px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'elevation-3': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
      },
      aspectRatio: {
        '4/5': '4 / 5',
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
};

export default config;
