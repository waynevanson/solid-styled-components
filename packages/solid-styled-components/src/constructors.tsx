import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  mergeProps,
} from "solid-js"
import { Dynamic } from "solid-js/web"
import { CreateStyled, Styled, StyledArgs } from "./types"
import { css } from "goober"
import { useTheme } from "./context"

// g: Global
// k: Keyframes
// optional
export type GooberFlags = { g: boolean } | { k: boolean } | {}

export type GooberContext = GooberFlags & {
  // Target element
  t?: unknown
  // Props from template literals
  p?: unknown

  o?: boolean
}

const GOOBER_CLASS_REGEXP = /^go[0-9]+/

export function createClassName(
  props: { class?: string | undefined } | Record<string, any>,
  args: StyledArgs
) {
  const classNameFromProps = createMemo(
    () => ("class" in props && props.class) || ""
  )

  const context = createMemo(
    (): GooberContext => ({
      // append
      o: GOOBER_CLASS_REGEXP.test(classNameFromProps()),
      p: props,
    })
  )

  const [identifier, identifierSet] = createSignal("")

  // todo: this creates a side effect.
  // should we set this state differently?
  createEffect(() => {
    identifierSet(css.apply(context(), args as never))
  })

  const className = createMemo(() =>
    [classNameFromProps(), identifier()].filter(Boolean).join(" ")
  )

  return className
}

function createStyled<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag
): Styled<ComponentProps<Tag>> {
  function Styled(...args: StyledArgs) {
    function StyledComponent(props: ComponentProps<Tag>) {
      const theme = useTheme()
      const propsWithTheme = createMemo(() => mergeProps(props, { theme }))

      const className = createClassName(propsWithTheme(), args)

      // todo: add `as` props as the component
      const componentProps = createMemo(() =>
        mergeProps(propsWithTheme(), { class: className(), component: tag })
      )

      //@ts-expect-error
      return <Dynamic {...componentProps()} />
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
