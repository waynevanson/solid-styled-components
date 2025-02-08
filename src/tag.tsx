import { JSX, splitProps } from "solid-js"
import { Dynamic } from "solid-js/web"

export type PolymorphicPropsMorphed<
  Tag extends keyof JSX.IntrinsicElements,
  As extends Exclude<keyof JSX.IntrinsicElements, Tag>,
  Props extends {}
> = { ref?: As; as: As } & FastOmit<Props, keyof JSX.IntrinsicElements[Tag]> &
  JSX.IntrinsicElements[As]

export type PolymorphicProps<
  Tag extends keyof JSX.IntrinsicElements,
  As extends Exclude<keyof JSX.IntrinsicElements, Tag>,
  Props extends {}
> = ({ ref?: Tag; as?: Tag } & Props) | PolymorphicPropsMorphed<Tag, As, Props>

export interface PolymorphicComponent<
  Tag extends keyof JSX.IntrinsicElements,
  Props extends Record<string, any>
> {
  <As extends Exclude<keyof JSX.IntrinsicElements, Tag>>(
    props: PolymorphicProps<Tag, As, Props>
  ): JSX.Element
}

export function tag<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag
): PolymorphicComponent<Tag, JSX.IntrinsicElements[Tag]> {
  return (props) => {
    const [{ as = tag }, rest] = splitProps(props, ["as"])
    // @ts-ignore
    return <Dynamic component={as} {...rest} />
  }
}

export type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K]
}
