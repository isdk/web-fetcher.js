import { defineConfig, globalIgnores } from "eslint/config";
import tsdoc from "eslint-plugin-tsdoc";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["web/**/*", "docs/**/*"]), {
    extends: compat.extends("prettier"),

    plugins: {
        tsdoc,
    },

    rules: {
        "tsdoc/syntax": "off",
        "no-cond-assign": "off",
        "yml/plain-scalar": "off",
        "yml/quotes": "off",
        "unicorn/prefer-number-properties": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
}]);