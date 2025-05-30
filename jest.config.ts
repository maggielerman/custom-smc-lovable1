/** @type {import('ts-jest').JestConfigTs} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
}; 