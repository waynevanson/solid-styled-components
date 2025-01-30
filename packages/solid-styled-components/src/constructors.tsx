import { ComponentProps, JSX } from "solid-js"
import { Dynamic } from "solid-js/web"
import { CreateStyled, Styled } from "./types"
import { useTheme } from "./context"

function createStyled<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag
): Styled<ComponentProps<Tag>> {
  function Styled(strings: ReadonlyArray<string>) {
    function StyledComponent(props: ComponentProps<Tag>) {
      return <Dynamic component={tag} {...props} />
    }

    return StyledComponent
  }

  return Styled
}

export const styled: CreateStyled = new Proxy(createStyled as never, {
  get(target, property) {
    if (typeof property === "symbol") {
      throw new Error(
        `Expected property to be a string but received a symbol of ${property.toString()}`
      )
    }

    //@ts-expect-error
    return target(property)
  },
})
