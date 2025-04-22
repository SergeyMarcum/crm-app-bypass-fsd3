// eslint.config.js
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  { ignores: ["dist"] },
  // Конфигурация для исходного кода (src/)
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^isAuthenticated$",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          allowIIFEs: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": ["error"],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "src/features/**/*",
              from: "src/features/**/*",
              except: ["./"],
              message: "Features should not depend on other features.",
            },
            {
              target: "src/entities/**/*",
              from: "src/features/**/*",
              message: "Entities should not depend on features.",
            },
            {
              target: "src/shared/**/*",
              from: [
                "src/features/**/*",
                "src/entities/**/*",
                "src/pages/**/*",
              ],
              message:
                "Shared should not depend on features, entities, or pages.",
            },
            {
              target: "src/features/**/*",
              from: "src/pages/**/*",
              message: "Features should not depend on pages.",
            },
          ],
        },
      ],
    },
  },
  // Конфигурация для тестов (tests/)
  {
    files: ["tests/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.tests.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
);
