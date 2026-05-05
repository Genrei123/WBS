import nextConfig from "eslint-config-next";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/", ".vercel/", ".sanity/", "node_modules/"],
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
