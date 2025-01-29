/// <reference types="vitest" />
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid()],
  resolve: { conditions: ["development", "browser"] },
  test: { server: { deps: { inline: true } } },
})
