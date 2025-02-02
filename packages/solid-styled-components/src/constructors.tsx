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
  StyledArgsProperty,
  StyledComponent,
  StyledProps,
  Substitute,
} from "./types"

/**
 * @summary
 * Create a Styleable instance given a tag name.
 *
 * @description
 * Under the hood will eventually create a component that will create the styles provided in later steps,
 * and apply them to the underlying element as a class name using Goober's CSS API.
 *
 * @param tag String related to an element tag
 * @returns
 */
// tag is really just a default for `as` right?
// todo: support custom components.
function createStyledTag<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag
): StyleableCallable<ComponentProps<Tag>> {
  return (...args) => {
    function StyledComponent(props: StyledProps<ComponentProps<Tag>>) {
      const theme = useTheme()
      const themed = createMemo(() => mergeProps(props, { theme }))

      const styled = createMemo(() =>
        (props[StyledArgsProperty] ?? []).concat([args])
      )

      const className = createClassName(themed() as never, styled())

      // todo: add `as` props as the component
      const componentProps = createMemo(() =>
        mergeProps(props, { class: className(), component: tag })
      )

      //@ts-ignore
      return <Dynamic {...componentProps()} />
    }

    return StyledComponent
  }
}

/**
 * @summary
 * Create a new Styleable from a component that has already been styled.
 * This feels like a monadic bind.
 *
 * @description
 * Under the hood, this applies a hidden property that prepends the previous style args
 * to props so that the underlying StyledComponent can consume when the component is called.
 *
 * @param Styled
 * @returns
 */
function createStyleableComposition<OuterProps extends {}>(
  Styled: StyledComponent<OuterProps>
): StyleableCallable<OuterProps> {
  return (...args) =>
    (props) => {
      const styled = createMemo(() => {
        const styled = props[StyledArgsProperty] ?? []
        return [...styled, args]
      })

      const nexts = createMemo(() =>
        mergeProps(props, { [StyledArgsProperty]: styled() })
      )

      //@ts-ignore
      return <Styled {...nexts()} />
    }
}

function createStyled(target: string | Function) {
  if (typeof target === "string") {
    return createStyledTag(target as never)
  } else {
    return createStyleableComposition(target as never)
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
 * which creates a `Styleable`.
 */
function functionalise<OuterProps extends {}>(
  callable: StyleableCallable<OuterProps>
): Styleable<OuterProps> {
  return Object.assign(callable, {
    attrs: <InnerProps extends Partial<OuterProps>>(attrs_: InnerProps) =>
      functionalise(attrs(callable, attrs_)),
  } satisfies StyleableMethods<OuterProps>)
}

export const styled: Styled = new Proxy(createStyled as any, {
  get(target, property) {
    if (typeof property === "symbol") {
      throw new Error(
        `Expected property to be a string but received a symbol of ${property.toString()}`
      )
    }

    // transforms syntax of `styled.div` into `styled("div")`
    const callable = target(property)

    // allow use of binded methods like `.attrs()`
    return functionalise(callable)
  },
})
