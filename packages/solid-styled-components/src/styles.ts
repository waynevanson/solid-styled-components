import { CSSAttribute } from "goober"

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
