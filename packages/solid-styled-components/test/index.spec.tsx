import { styled } from "../src"
import { describe, test, expect } from "vitest"
import { render } from "@solidjs/testing-library"
import { DOMElements } from "solid-js/web"

describe("styled", () => {
  const tags = Array.from(DOMElements.values())

  describe.each(tags)("%s", (tag) => {
    test("parameter", () => {
      const Component = styled(tag as any)``
      const screen = render(() => <Component />)

      const element = screen.container.children.item(0)
      expect(element?.localName).toBe(tag)
    })

    test("index", () => {
      //@ts-expect-error
      const Component = styled[tag]``
      const screen = render(() => <Component />)

      const element = screen.container.children.item(0)
      expect(element?.localName).toBe(tag)
    })
  })
})
