import { styled } from "../src"
import { describe, test, expect } from "vitest"
import { render } from "@solidjs/testing-library"
import { DOMElements } from "solid-js/web"

describe("styled", () => {
  const tags = Array.from(DOMElements.values())

  test.each(tags)("%s", (tag) => {
    const Component = styled(tag as any)``
    const screen = render(() => <Component />)

    const element = screen.container.children.item(0)
    expect(element?.localName).toBe(tag)
  })
})
