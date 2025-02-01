import {
  ComponentProps,
  createMemo,
  indexArray,
  JSX,
  mergeProps,
} from "solid-js"
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

// tag is really just a default for `as` right?
export function createStyledFactory<Tag extends keyof JSX.IntrinsicElements>(
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

// we can add our styles to the props,
// and consume that inside of our real component.
export function createStyleableComposition<OuterProps extends {}>(
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

function bro(target) {
  if (typeof target === "string") {
    return createStyledFactory(target)
  } else {
    return createStyleableComposition(target)
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

export const styled: Styled = new Proxy(bro as never, {
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
