const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    theme: {
      extend: {
        spacing: {
          inherit: 'inherit',
          unset: 'unset',
          13: '3.25rem',
          86: '21.5rem',
          120: '30rem',
          128: '32rem',
          144: '36rem',
          256: '64rem',
        },
        minHeight: (theme) => ({
          ...theme('spacing'),
        }),
        maxHeight: (theme) => ({
          ...theme('spacing'),
        }),
        minWidth: (theme) => ({
          ...theme('spacing'),
        }),
        maxWidth: (theme) => ({
          ...theme('spacing'),
        }),
        colors: {
          inherit: 'inherit',
        },
      },
    },
  },
  plugins: [],
};
