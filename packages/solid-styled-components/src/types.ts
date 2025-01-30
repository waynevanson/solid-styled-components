import { Component, ComponentProps, JSX } from "solid-js"

// props
export interface StyledComponent<OuterProps extends {}>
  extends Component<OuterProps> {}

// attrs, tempalte string
export interface Styled<OuterProps extends {}> {
  (
    strings: ReadonlyArray<string>,
    ...expressions: ReadonlyArray<unknown>
  ): StyledComponent<OuterProps>
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
