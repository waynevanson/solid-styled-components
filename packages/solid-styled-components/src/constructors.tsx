import { ComponentProps, createMemo, JSX, mergeProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import { createClassName } from "./class-name"
import { useTheme } from "./context"
import { attrs } from "./methods"
import {
  Styleable,
  StyleableCallable,
  StyleableMethods,
  Styled,
  Substitute,
} from "./types"

// tag is really just a default for `as` right?
export function createStyledFactory<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag
): StyleableCallable<ComponentProps<Tag>> {
  return (...args) =>
    (props) => {
      // todo: add `as` props as the component
      const theme = useTheme()
      const className = createClassName(mergeProps(props, { theme }), args)

      const componentProps = createMemo(() =>
        mergeProps(props, {
          class: className(),
          component: tag,
        })
      )

      //@ts-ignore
      return <Dynamic {...componentProps()} />
    }
}

export interface StyledMethods<OuterProps extends {}> {
  attrs<InnerProps extends Partial<OuterProps>>(
    attrs: InnerProps
  ): Styleable<Substitute<OuterProps, InnerProps>>
}

/**
 * @summary
 * Adds the methods from `StylableMethods` onto a `StyleableCallable`,
 * which creates a `Stylable`.
 */
function functionalise<OuterProps extends {}>(
  callable: StyleableCallable<OuterProps>
): Styleable<OuterProps> {
  return Object.assign(callable, {
    attrs: <InnerProps extends Partial<OuterProps>>(attrs_: InnerProps) =>
      functionalise(attrs(callable, attrs_)),
  } satisfies StyleableMethods<OuterProps>)
}

export const styled: Styled = new Proxy(createStyledFactory as never, {
  get(target, property) {
    if (typeof property === "symbol") {
      throw new Error(
        `Expected property to be a string but received a symbol of ${property.toString()}`
      )
    }

    //@ts-ignore
    const callable = target(property)

    // allow use of binded methods like `.attrs()`
    return functionalise(callable)
  },
})
