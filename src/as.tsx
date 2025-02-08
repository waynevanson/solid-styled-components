import { JSX } from "solid-js"
import { PolymorphicComponent, PolymorphicPropsMorphed } from "./tag"

export function as<
  Tag extends keyof JSX.IntrinsicElements,
  As extends keyof JSX.IntrinsicElements,
  Props extends {}
>(
  Component: PolymorphicComponent<Tag, Props>,
  as: As
): PolymorphicComponent<As, PolymorphicPropsMorphed<Tag, As, Props>> {
  return (props) => {
    // @ts-ignore
    return <Component as={as} {...props} />
  }
}
