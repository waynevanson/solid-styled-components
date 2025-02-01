import { CSSAttribute } from "goober"
import { Component, ComponentProps, JSX } from "solid-js"

// Create a `Stylable` instance.

export interface StyledCallable {
  <Tag extends keyof JSX.IntrinsicElements>(tag: Tag): Styleable<
    ComponentProps<Tag>
  >
}

export type StyledTag = {
  [Tag in keyof JSX.IntrinsicElements]: Styleable<ComponentProps<Tag>>
}

export interface Styled extends StyledCallable, StyledTag {}

// Can have a style added to it to return a component

export interface StyleableCallable<OuterProps extends {}> {
  (...styles: StyledArgs<OuterProps>): Component<OuterProps>
}

export interface StyleableMethods<OuterProps extends {}> {
  attrs<InnerProps extends Partial<OuterProps> & {}>(
    attrs: InnerProps
  ): Styleable<Omit<OuterProps, keyof InnerProps>>

  attrs<InnerProps extends Partial<OuterProps> & {}>(
    attrs: (props: OuterProps) => InnerProps
  ): Styleable<Substitute<OuterProps, InnerProps>>
}

export interface Styleable<OuterProps extends {}>
  extends StyleableCallable<OuterProps>,
    StyleableMethods<OuterProps> {}

// Argument for Stylable

// todo: replace with props

export type TemplateExpressionValue = string | number

export type TemplateExpression<OuterProps> =
  | ((props: OuterProps) => TemplateExpressionValue)
  | TemplateExpressionValue

export type StyleArgValue = CSSAttribute | string
export type StyleArg<OuterProps> =
  | StyleArgValue
  | ((props: OuterProps) => StyleArgValue)

export type StyledArgs<OuterProps> =
  | readonly [styles: StyleArg<OuterProps>]
  | readonly [
      styles: TemplateStringsArray,
      ...expressions: ReadonlyArray<OuterProps>
    ]

// utils

export type TagKind = keyof JSX.IntrinsicElements

// todo: use fast omit
export type Substitute<T, U> = Omit<T, keyof U> & U
