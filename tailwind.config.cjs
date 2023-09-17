/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'dark',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
    colors: {
      // Using modern `rgb`
      primary: 'rgb(var(--kbs-color-primary) / <alpha-value>)',
      secondary: 'rgb(var(--kbs-color-secondary) / <alpha-value>)',
      tertiary: 'rgb(var(--kbs-color-tertiary) / <alpha-value>)',
      contrast: 'rgb(var(--kbs-color-contrast) / <alpha-value>)',

      transparent: 'transparent',

      white: 'rgb(var(--kbs-color-white) / <alpha-value>)',
      'blue': {
        '50': '#ebf1ff',
        '100': '#dae6ff',
        '200': '#bccfff',
        '300': '#93afff',
        '400': '#6981ff',
        '500': '#4655ff',
        '600': '#2627ff',
        '700': '#1d1ae8',
        '800': '#1b1bcc',
        '900': '#1d2092',
        '950': '#111155',
        DEFAULT: 'rgb(var(--kbs-color-blue) / <alpha-value>)',
      },
      red: {
        DEFAULT: 'rgb(var(--kbs-color-red) / <alpha-value>)',
      },
      green: 'rgb(var(--kbs-color-green) / <alpha-value>)',
      pink: 'rgb(var(--kbs-color-pink) / <alpha-value>)',
      black: 'rgb(var(--kbs-color-black) / <alpha-value>)',
      gray: {
        '200': 'rgb(var(--kbs-color-gray-200) / <alpha-value>)',
        '900': 'rgb(var(--kbs-color-gray-900) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
