// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@widgets/(.*)$": "<rootDir>/src/widgets/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
};
