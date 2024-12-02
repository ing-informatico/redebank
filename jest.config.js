module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*{.test,.spec}.{js,jsx,ts,tsx}',
      '!src/index.js',
    ],
  };