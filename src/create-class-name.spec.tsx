import { describe, expect, test } from "vitest"
import { createClassName } from "./create-class-name"
import { renderHook, waitFor } from "@solidjs/testing-library"

const template = (...args: [TemplateStringsArray, ...ReadonlyArray<any>]) =>
  args

const sheet = () =>
  document.head.querySelector("#_goober") as HTMLStyleElement | null

describe(createClassName, () => {
  describe("dont throw", () => {
    test("object", () => {
      renderHook(() => createClassName({}, [{}]))
    })

    test("object array", () => {
      renderHook(() => createClassName({}, [[{}]]))
    })

    test("template", () => {
      renderHook(() => createClassName({}, template`sdsd`))
    })

    test("template array", () => {
      renderHook(() => createClassName({}, [template`sdsds,${""}`]))
    })
  })

  test("should create a classname when it does not exist", async () => {
    const screen = renderHook(() =>
      createClassName({}, template`display: flex;`)
    )
    await waitFor(() => {
      expect(sheet()?.textContent).toBe("")
    })

    // expect(screen.result()).toMatch(/^go[0-9]+$/)
  })

  test.todo("should append a normal classname")

  test.todo("should append a goober classname")
})
