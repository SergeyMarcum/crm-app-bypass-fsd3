import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  // Игнорирование папки сборки
  { ignores: ["dist"] },

  // Основная конфигурация для TS/TSX файлов
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      // Правила React Hooks
      ...reactHooks.configs.recommended.rules,
      // Проверка экспорта компонентов для React Refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Правила TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": ["warn"],
      "@typescript-eslint/no-explicit-any": ["error"],

      // Контроль зависимостей для FSD 3.0
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // Запрет импорта других фич из фич
            {
              target: "src/features/**/*",
              from: "src/features/**/*",
              except: ["./"],
              message: "Features should not depend on other features.",
            },
            // Запрет импорта фич в сущности
            {
              target: "src/entities/**/*",
              from: "src/features/**/*",
              message: "Entities should not depend on features.",
            },
            // Запрет импорта страниц, фич или сущностей в shared
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
            // Запрет импорта страниц в фичи
            {
              target: "src/features/**/*",
              from: "src/pages/**/*",
              message: "Features should not depend on pages.",
            },
          ],
        },
      ],
    },
  }
);
