import { describe, test, expect } from "vitest"
import { tag } from "./tag"
import { DOMElements } from "solid-js/web"
import { JSX } from "solid-js"
import { render } from "@solidjs/testing-library"

describe("tag", () => {
  const tags = Array.from(DOMElements.values()) as ReadonlyArray<
    keyof JSX.IntrinsicElements
  >

  describe.each(tags)("%s", (kind) => {
    test("should render element with the tags name", () => {
      const Component = tag(kind)
      const screen = render(() => <Component />)
      const element = screen.container.children.item(0)!
      expect(element.localName).toBe(kind)
    })
  })
})
