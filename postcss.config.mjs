/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: { config: './config/tailwind.config.js' },
  },
};

export default config;
