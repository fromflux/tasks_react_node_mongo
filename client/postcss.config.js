/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require('autoprefixer'),
    require('postcss-nested'),
  ],
};

module.exports = config;
