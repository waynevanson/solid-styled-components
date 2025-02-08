import { JSX, mergeProps } from "solid-js"
import { PolymorphicComponent, PolymorphicPropsMorphed } from "./tag"
import { contramap } from "./contramap"

export function as<
  Tag extends keyof JSX.IntrinsicElements,
  As extends Exclude<keyof JSX.IntrinsicElements, Tag>,
  Props extends Record<string, any>
>(
  Component: PolymorphicComponent<Tag, Props>,
  as: As
): PolymorphicComponent<As, PolymorphicPropsMorphed<Tag, As, Props>> {
  //@ts-ignore
  return contramap(Component, (props) => mergeProps(props, { as }))
}
