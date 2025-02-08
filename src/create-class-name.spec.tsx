import { describe, test } from "vitest"
import { createClassName } from "./create-class-name"
import { renderHook } from "@solidjs/testing-library"

describe(createClassName, () => {
  describe("dont throw", () => {
    test("object", () => {
      renderHook(() => createClassName({}, [{}]))
    })

    test("object array", () => {
      renderHook(() => createClassName({}, [[{}]]))
    })

    test("template", () => {
      const template = (
        ...args: [TemplateStringsArray, ...ReadonlyArray<any>]
      ) => args

      renderHook(() => createClassName({}, template`sdsd`))
    })

    test("template array", () => {
      const template = (
        ...args: [TemplateStringsArray, ...ReadonlyArray<any>]
      ) => args

      renderHook(() => createClassName({}, [template`sdsds,${""}`]))
    })
  })
})
