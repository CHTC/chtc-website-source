import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // Don't lint build output, generated files, or static assets — source only.
    // (`next lint` applied these implicitly; the ESLint CLI needs them explicit.)
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "public/**",
      ".unlighthouse/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // next-image-export-optimizer `require()`s this file, so it has to be
    // CommonJS.
    files: ["remoteOptimizedImages.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
];

export default eslintConfig;
