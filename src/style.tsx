import { CSSAttribute } from "goober"
import { Component, mergeProps } from "solid-js"
import { createClassName } from "./create-class-name"

/**
 * @summary
 *
 * @description
 * 1. Creates a class in a stylesheet on the window.
 * 2. Append that class to the components props.
 * 3. Return the component.
 *
 * @param component
 * @param styles
 * @returns
 */
function styler<Props extends Record<string, any>>(
  component: Component<Props>,
  styles: StyledArgs<Props>
): Component<Props> {
  return (props) => {
    const className = createClassName(props, styles)
    const newprops = mergeProps(props, { class: className() }) as never
    return component(newprops)
  }
}

export type TemplateExpressionValue = string | number | null | undefined | false

export type TemplateExpression<OuterProps> =
  | ((props: OuterProps) => TemplateExpressionValue)
  | TemplateExpressionValue

export type StyleArgValue = CSSAttribute | string
export type OneOrMany<T> = T | ReadonlyArray<T>
export type StyleArgSingle<OuterProps> =
  | StyleArgValue
  | ((props: OuterProps) => StyleArgValue)

export type StyleArg<OuterProps> = OneOrMany<StyleArgSingle<OuterProps>>

export type StyledArgsTemplate<ThemedProps> = readonly [
  styles: TemplateStringsArray,
  ...expressions: ReadonlyArray<ThemedProps>
]

export type StyledArgsStyles<ThemedProps> =
  | readonly [styles: StyleArg<ThemedProps>]

export type StyledArgs<ThemedProps> =
  | StyledArgsStyles<ThemedProps>
  | StyledArgsTemplate<ThemedProps>

export function style<Props extends Record<string, any>>(
  component: Component<Props>
): (...styles: StyledArgs<Props>) => Component<Props>

export function style<Props extends Record<string, any>>(
  component: Component<Props>,
  styles: StyledArgs<Props>
): Component<Props>

export function style<Props extends Record<string, any>>(
  component: Component<Props>,
  styles: ReadonlyArray<StyleArgSingle<Props>>
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
