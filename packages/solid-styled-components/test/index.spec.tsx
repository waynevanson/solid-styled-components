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

  // how to test where the css goes?
  describe("class", () => {
    test("should have default className when unset", () => {
      const Component = styled.div``
      const screen = render(() => <Component />)
      const element = screen.container.children.item(0)
      expect(element).toHaveProperty("className", "go11")
    })

    test("a class property when passed through and no styles", () => {
      const className = "hello-world"
      const Component = styled.div``
      const screen = render(() => <Component class={className} />)
      const element = screen.container.children.item(0)
      expect(element).toHaveProperty("className", `${className} go11`)
    })

    test("a class property when there are styles", () => {
      const Component = styled.div`
        background-color: pink;
      `
      const screen = render(() => <Component />)
      const element = screen.container.children.item(0)
      expect(element).toHaveProperty("className", "go2856660522")
    })

    test("a class property when passed through and styles", () => {
      const className = "hello-world"
      const Component = styled.div`
        background-color: pink;
      `
      const screen = render(() => <Component class={className} />)
      const element = screen.container.children.item(0)
      expect(element).toHaveProperty("className", `${className} go2856660522`)
    })
  })
})
