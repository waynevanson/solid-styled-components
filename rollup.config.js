//@ts-check
import withSolid from "rollup-preset-solid"
import minify from "@rollup/plugin-terser"

export default withSolid({
  input: "src/index.tsx",
})
