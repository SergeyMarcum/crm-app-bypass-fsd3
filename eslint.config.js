// eslint.config.js
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  { ignores: ["dist"] }, // Конфигурация для исходного кода (src/)
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
            // Правила для слоя app (может импортировать все) - не нужны отдельные запреты на импорт
            // Правила для слоя pages (pages не могут импортировать app.)
            {
              target: "src/pages/**/*",
              from: "src/app/**/*",
              message: "Pages should not depend on app (cyclic dependency).",
            },
            // Правила для слоя widgets
            // widgets не могут импортировать app или pages.
            {
              target: "src/widgets/**/*",
              from: "src/app/**/*",
              message: "Widgets should not depend on app.",
            },
            {
              target: "src/widgets/**/*",
              from: "src/pages/**/*",
              message: "Widgets should not depend on pages.",
            },
            // Правила для слоя features
            // features не могут импортировать app, pages, widgets. (Ваше правило Features should not depend on other features. оставлено, так как это ключевой принцип FSD)
            {
              target: "src/features/**/*",
              from: "src/features/**/*",
              except: ["./"], // Разрешаем импорты внутри своей фичи
              message: "Features should not depend on other features.",
            },
            {
              target: "src/features/**/*",
              from: "src/app/**/*",
              message: "Features should not depend on app.",
            },
            {
              target: "src/features/**/*",
              from: "src/pages/**/*",
              message: "Features should not depend on pages.",
            },
            {
              target: "src/features/**/*",
              from: "src/widgets/**/*",
              message: "Features should not depend on widgets.",
            },
            // Правила для слоя entities
            // entities не могут импортировать app, pages, widgets, features.
            {
              target: "src/entities/**/*",
              from: "src/app/**/*",
              message: "Entities should not depend on app.",
            },
            {
              target: "src/entities/**/*",
              from: "src/pages/**/*",
              message: "Entities should not depend on pages.",
            },
            {
              target: "src/entities/**/*",
              from: "src/widgets/**/*",
              message: "Entities should not depend on widgets.",
            },
            {
              target: "src/entities/**/*",
              from: "src/features/**/*",
              message: "Entities should not depend on features.",
            },
            // Правила для слоя shared
            // shared не может импортировать ничего из app, pages, widgets, features, entities.
            {
              target: "src/shared/**/*",
              from: "src/app/**/*",
              message: "Shared should not depend on app.",
            },
            {
              target: "src/shared/**/*",
              from: "src/pages/**/*",
              message: "Shared should not depend on pages.",
            },
            {
              target: "src/shared/**/*",
              from: "src/widgets/**/*",
              message: "Shared should not depend on widgets.",
            },
            {
              target: "src/shared/**/*",
              from: "src/features/**/*",
              message: "Shared should not depend on features.",
            },
            {
              target: "src/shared/**/*",
              from: "src/entities/**/*",
              message: "Shared should not depend on entities.",
            },

            // Правило для публичных API (только через index.ts)
            {
              target:
                "src/(pages|widgets|features|entities|shared)/*/(?!index.ts)", // Цель: любой файл, кроме index.ts, внутри слайса/сегмента
              from: "src/(pages|widgets|features|entities|shared)/*/*", // Источник: любой файл внутри другого слайса/сегмента
              message:
                "Import from public API (index.ts) of slices/segments is required.",
            },
          ],
        },
      ],
    },
  }, // Конфигурация для тестов (tests/)
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

// Применить эти правила: запустить ESLint (npm run lint или аналогичную команду) и исправить все ошибки, которые могут возникнуть из-за новых правил.
// Это поможет выявить существующие нарушения FSD в кодовой базе.
