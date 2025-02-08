/// <reference types="vitest" />
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import withSolid from "rollup-preset-solid"

const rollupOptions = withSolid({
  input: "src/index.tsx",
})

rollupOptions.output.forEach((output) => {
  delete output.sourcemap
  output.entryFileNames = "[name].js"
  output.chunkFileNames = "[name].js"
})

export default defineConfig({
  plugins: [solid()],
  build: {
    rollupOptions,
    sourcemap: true,
  },
})
