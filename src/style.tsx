import { CSSAttribute } from "goober"
import { Component, mergeProps } from "solid-js"
import { createClassName } from "./create-class-name.js"

/**
 * @summary
 *
 * @description
 * 1. Creates a class in a stylesheet on the window.
 * 2. Append that class to the components props.
 * 3. Return the component.
 *
 * @param Component
 * @param styles
 * @returns
 */
export function styler<Props extends Record<string, any>>(
  Component: Component<Props>,
  styles: StyledArgs<Props>
): Component<Props> {
  return (props) => {
    const className = createClassName(props, styles)

    //@ts-ignore
    return <Component {...mergeProps(props, { class: className() })} />
  }
}

// style template strings

export type TemplateExpressionValue = string | number | null | undefined | false

export type TemplateExpression<OuterProps> =
  | ((props: OuterProps) => TemplateExpressionValue)
  | TemplateExpressionValue

export type StyledArgsTemplate<Props> = readonly [
  styles: TemplateStringsArray,
  ...expressions: ReadonlyArray<TemplateExpression<Props>>
]

// style objects

export type StyleArgValue = CSSAttribute | string
export type StyleArgSingle<Props> =
  | StyleArgValue
  | ((props: Props) => StyleArgValue)

export type OneOrMany<T> = T | ReadonlyArray<T>
export type StyleArg<Props> = OneOrMany<StyleArgSingle<Props>>

export type StyledArgsStyles<ThemedProps> =
  | readonly [styles: StyleArg<ThemedProps>]

// union

export type StyledArgs<ThemedProps> =
  | StyledArgsStyles<ThemedProps>
  | StyledArgsTemplate<ThemedProps>

export function style<Props extends Record<string, any>>(
  component: Component<Props>
): (...styles: StyledArgs<Props>) => Component<Props>

export function style<Props extends Record<string, any>>(
  component: Component<Props>,
  styles: ReadonlyArray<StyleArgSingle<Props>> | StyleArg<Props>
): Component<Props>

export function style(...args: Array<any>) {
  switch (args.length) {
    case 0:
      throw new Error("")
    case 1:
      return (styles: never) => styler(args[0], styles)
    case 2:
      const array = Array.isArray(args[1]) ? args[1] : [args[1]]
      return styler(args[0], array as never)
    default:
      return styler(args.shift(), args as any)
  }
}
