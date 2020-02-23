module.exports = {
  plugins: [
    require('postcss-normalize')({
      forceImport: [
        'normalize/*',
        'sanitize',
        'sanitize/forms',
        'sanitize/typography',
      ]
    }),
  ]
}