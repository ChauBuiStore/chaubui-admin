import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Turn off rules that conflict with Prettier
  eslintConfigPrettier,
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // Surface Prettier issues as ESLint errors
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: false,
          printWidth: 100,
          tabWidth: 2,
          trailingComma: "all",
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "lf",
        },
      ],
    },
  },
];

export default eslintConfig;
