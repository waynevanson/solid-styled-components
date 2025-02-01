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
  (...styles: StyledArgs): Component<OuterProps>
}

export interface StyleableMethods<OuterProps extends {}> {
  attrs<InnerProps extends Partial<OuterProps>>(
    attrs: InnerProps
  ): Styleable<Substitute<OuterProps, InnerProps>>
}

export interface Styleable<OuterProps extends {}>
  extends StyleableCallable<OuterProps>,
    StyleableMethods<OuterProps> {}

// Argument for Stylable

// todo: replace with props
export type TemplateExpressionParameter = {}

export type TemplateExpressionValue = string | number

export type TemplateExpression =
  | ((props: TemplateExpressionParameter) => TemplateExpressionValue)
  | TemplateExpressionValue

export type StyledArgs =
  | readonly [styles: CSSAttribute | string]
  | readonly [
      styled: TemplateStringsArray,
      ...expressions: ReadonlyArray<TemplateExpression>
    ]

// utils

export type TagKind = keyof JSX.IntrinsicElements

export type Substitute<T, U> = Omit<T, keyof U> & U
