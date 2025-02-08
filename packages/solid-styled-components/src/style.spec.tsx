import { describe, test, expect } from "vitest"
import { render } from "@solidjs/testing-library"
import { style } from "./style"
import { tag } from "./tag"

describe(style, () => {
  test("tagged template", () => {
    const Tag = tag("ul")
    const Styled = style(Tag)``
    const screen = render(() => <Styled />)
    const element = () => screen.getByRole("list")

    expect(element()).toBeVisible()
  })

  test("styles object", () => {
    const Tag = tag("ul")
    const Styled = style(Tag, [{}])
    const screen = render(() => <Styled />)
    const element = () => screen.getByRole("list")

    expect(element()).toBeVisible()
  })

  test("styles array object", () => {
    const Tag = tag("ul")
    const Styled = style(Tag, [[{}]])
    const screen = render(() => <Styled />)
    const element = () => screen.getByRole("list")

    expect(element()).toBeVisible()
  })

  test("object", () => {
    const Tag = tag("ul")
    const Styled = style(Tag, {})
    const screen = render(() => <Styled />)
    const element = () => screen.getByRole("list")

    expect(element()).toBeVisible()
  })

  test("object", () => {
    const Tag = tag("ul")
    const Styled = style(Tag, [{}, {}, {}, {}])
    const screen = render(() => <Styled />)
    const element = () => screen.getByRole("list")

    expect(element()).toBeVisible()
  })
})
