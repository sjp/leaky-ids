import { defineConfig } from "vite-plus";
import preact from "@preact/preset-vite";

// https://vite.dev/config/
export default defineConfig({
  // Oxfmt formatting (vp fmt / vp check). The previous biome.json formatter
  // settings (2-space indent, LF, 100 print width, double quotes, "as-needed"
  // quote props, trailing commas, always semicolons, always arrow parens,
  // bracket spacing) all match Oxfmt's defaults, so no overrides are needed.
  fmt: {},
  // Oxlint linting (vp lint / vp check).
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      // Ported from the previous biome.json style rules.
      "no-param-reassign": "error", // biome noParameterAssign
      "typescript/prefer-as-const": "error", // biome useAsConstAssertion
      "default-param-last": "error", // biome useDefaultParameterLast
      "typescript/prefer-enum-initializers": "error", // biome useEnumInitializers
      "react/self-closing-comp": "error", // biome useSelfClosingElements
      "typescript/no-inferrable-types": "error", // biome noInferrableTypes
      "unicorn/prefer-number-properties": "error", // biome useNumberNamespace
      "no-else-return": "error", // biome noUselessElse
    },
  },
  plugins: [
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
      },
    }),
  ],
  css: { preprocessorOptions: { scss: { quietDeps: true } } },
});
