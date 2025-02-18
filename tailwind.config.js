/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fraunces', 'serif'],
      },
      fontSize: {
        xs: '0.8125rem',     /* 13px */
        sm: '0.9375rem',     /* 15px */
        base: '1.125rem',    /* 18px */
        lg: '1.25rem',       /* 20px */
        xl: '1.5rem',        /* 24px */
        '2xl': '1.875rem',   /* 30px */
        '3xl': '2.25rem',    /* 36px */
        '4xl': '3rem',       /* 48px */
      },
      colors: {
        brand: 'var(--color-brand)',
        accent: 'var(--color-accent)',
      },
      backgroundColor: {
        primary: 'var(--color-bg-primary)',
        secondary: 'var(--color-bg-secondary)',
      },
      textColor: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
      },
      borderColor: {
        DEFAULT: 'var(--color-border)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        bold: 'var(--font-weight-bold)',
      },
    },
  },
  plugins: [],
};
