import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import parser from "@typescript-eslint/parser";
import globals from "globals";

import importPlugin from "eslint-plugin-import";

export default defineConfig([
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser,
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/export": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-mutable-exports": "error",
    },
  },
]);