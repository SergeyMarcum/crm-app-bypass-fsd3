// jest.config.js
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.tests.json" }],
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/tests/styleMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@widgets/(.*)$": "<rootDir>/src/widgets/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
  },
};
