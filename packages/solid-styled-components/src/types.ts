import { Component, ComponentProps, JSX } from "solid-js"
import { StyledArgs } from "./styles"

export type StyledProps<OuterProps> = OuterProps & {
  /**
   * @summary
   * A property accessible only by the authors,
   * which allows combining styles from multiple StyledComponent's.
   */
  [StyledArgsProperty]?: ReadonlyArray<StyledArgs<OuterProps>>
}

// Create a `Stylable` instance.

export interface StyledCallable {
  /**
   * @summary
   * Create a Styleable component from a an element tag name.
   */
  <Tag extends keyof JSX.IntrinsicElements>(tag: Tag): Styleable<
    ComponentProps<Tag>
  >

  /**
   * @summary
   * Create a Styleable component from an existing StyledComponent,
   * providing an inheritence mechanism.
   */
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
  // https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/constructors/constructWithOptions.ts
  // todo: can we check the input props to see if we've used them?
  // if the return contains props that are part of the component (not new ones)
  // then enforce that users need to add their own types.
  attrs<
    RequiredProps extends {} = Partial<OuterProps>,
    PrivateAttrsReturn extends Partial<OuterProps> = Partial<OuterProps>
  >(
    attrs: (
      props: Substitute<OuterProps, RequiredProps>
    ) => Partial<OuterProps> & PrivateAttrsReturn
  ): Styleable<
    Substitute<
      FastOmit<OuterProps, keyof Required<PrivateAttrsReturn>>,
      RequiredProps
    >
  >

  /**
   * @summary
   * Create a new Styleable with props which override props provided by users.
   *
   * To derive props from existing, use  the function syntax instead
   *
   * `(props) => ({ /* new props *\/})`
   *
   * @example
   * ```tsx
   * import { styled } from 'styled-components-solid'
   *
   * // The link will ALWAYS be world.
   * const Component = styled.a.attrs({ href: "/hello"})``
   *
   * // works!
   * const First = () => <Component />
   *
   * // error - `href` does not exist on type `Component`
   * const Second = () => <Component href="/world" />
   * ```
   */
  attrs<InnerProps extends Partial<OuterProps> = never>(
    attrs: InnerProps
  ): Styleable<FastOmit<OuterProps, keyof InnerProps>>
}

export interface Styleable<OuterProps extends {}>
  extends StyleableCallable<OuterProps>,
    StyleableMethods<OuterProps> {}

export const StyledArgsProperty = Symbol("StyledArgsApplication")

// Components that have been styled
// do I need to get style from parent? gotta store that tage internall somewhere..

// "
// I'm styled so that means we gotta make the ...styles I consumed earlier accessible
// I don't contain a class name yet because props haven't been generated yet.
// "
export interface StyledComponent<OuterProps extends {}>
  extends Component<StyledProps<OuterProps>> {}

// Argument for Stylable

// utils

export type TagKind = keyof JSX.IntrinsicElements

export type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K]
}

export type Substitute<T extends {}, U extends {}> = FastOmit<T, keyof U> & U
