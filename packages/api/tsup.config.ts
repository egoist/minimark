import { defineConfig } from "tsup"

const IS_DEV = process.argv.includes("--watch")

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    db: "./src/db/index.ts",
  },
  format: "esm",
  env: {
    NODE_ENV: IS_DEV ? "development" : "production",
  },
  define: {
    IS_DEV: JSON.stringify(IS_DEV),
  },
  minifySyntax: true,
})
