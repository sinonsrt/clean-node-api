/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
}
