module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(),  // ✅ Proper plugin wrapper for v4+
    require('autoprefixer'),
  ],
};
