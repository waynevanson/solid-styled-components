import { CSSAttribute } from "goober"
import { Component, ComponentProps, JSX } from "solid-js"

export type StyledProps<OuterProps> = OuterProps & {
  [StyledArgsProperty]?: ReadonlyArray<StyledArgs<OuterProps>>
}

// Create a `Stylable` instance.

export interface StyledCallable {
  <Tag extends keyof JSX.IntrinsicElements>(tag: Tag): Styleable<
    ComponentProps<Tag>
  >
  <OuterProps extends {}>(
    target: StyledComponent<OuterProps>
  ): Styleable<OuterProps>
}

export type StyledTag = {
  [Tag in keyof JSX.IntrinsicElements]: Styleable<ComponentProps<Tag>>
}

export interface Styled extends StyledCallable, StyledTag {}

// Can have a style added to it to return a component

export interface StyleableCallable<OuterProps extends {}> {
  (...styles: StyledArgs<OuterProps>): StyledComponent<OuterProps>
}

export interface StyleableMethods<OuterProps extends {}> {
  attrs<InnerProps extends Partial<OuterProps> & {}>(
    attrs: InnerProps
  ): Styleable<Omit<OuterProps, keyof InnerProps>>

  // todo: can we check the input props to see if we've used them?
  // if the return contains props that are part of the component (not new ones)
  // then enforce that users need to add their own types.
  attrs<InnerProps extends Partial<OuterProps> & {}>(
    attrs: (props: OuterProps) => InnerProps
  ): Styleable<Substitute<OuterProps, InnerProps>>
}

export interface Styleable<OuterProps extends {}>
  extends StyleableCallable<OuterProps>,
    StyleableMethods<OuterProps> {}

export const StyledArgsProperty = Symbol("StyledArgsApplication")

// Components that have been styled
// do I need to get style from parent? gotta store that tage internall somewhere..

// "
// I'm styled so that means we gotta make the ...args I consumed earlier accessible
// I don't contain a class name yet because props haven't been generated yet.
// "
export interface StyledComponent<OuterProps extends {}>
  extends Component<StyledProps<OuterProps>> {}

// Argument for Stylable

export type TemplateExpressionValue = string | number

export type TemplateExpression<OuterProps> =
  | ((props: OuterProps) => TemplateExpressionValue)
  | TemplateExpressionValue

export type StyleArgValue = CSSAttribute | string
export type OneOrMany<T> = T | ReadonlyArray<T>
export type StyleArg<OuterProps> = OneOrMany<
  StyleArgValue | ((props: OuterProps) => StyleArgValue)
>
export type StyledArgs<ThemedProps> =
  | readonly [styles: StyleArg<ThemedProps>]
  | readonly [
      styles: TemplateStringsArray,
      ...expressions: ReadonlyArray<ThemedProps>
    ]

// utils

export type TagKind = keyof JSX.IntrinsicElements

// todo: use fast omit
export type Substitute<T, U> = Omit<T, keyof U> & U
