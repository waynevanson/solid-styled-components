import { CSSAttribute } from "goober"
import { Component, ComponentProps, JSX } from "solid-js"

// props
export interface StyledComponent<OuterProps extends {}>
  extends Component<OuterProps> {}

// attrs, tempalte string
export interface Styled<OuterProps extends {}> {
  (...args: StyledArgs): StyledComponent<OuterProps>
}

export interface CreateStyledComponent {
  <Tag extends keyof JSX.IntrinsicElements>(tag: Tag): Styled<
    ComponentProps<Tag>
  >
}

export type CreateStyledTag = {
  [Tag in keyof JSX.IntrinsicElements]: Styled<ComponentProps<Tag>>
}

export interface CreateStyled extends CreateStyledComponent, CreateStyledTag {}

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
