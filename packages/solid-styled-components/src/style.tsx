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
export function style<Props extends Record<string, any>>(
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
export type StyleArg<OuterProps> = OneOrMany<
  StyleArgValue | ((props: OuterProps) => StyleArgValue)
>

export type StyledArgsTemplate<ThemedProps> = readonly [
  styles: TemplateStringsArray,
  ...expressions: ReadonlyArray<ThemedProps>
]

export type StyledArgsStyles<ThemedProps> =
  | readonly [styles: StyleArg<ThemedProps>]

export type StyledArgs<ThemedProps> =
  | StyledArgsStyles<ThemedProps>
  | StyledArgsTemplate<ThemedProps>
