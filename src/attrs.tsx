import { JSX, mergeProps } from "solid-js"
import { FastOmit, PolymorphicComponent } from "./tag"

export function attrs<
  Tag extends keyof JSX.IntrinsicElements,
  Props extends Record<string, any>,
  Attrs extends Props
>(
  Component: PolymorphicComponent<Tag, Props>,
  attrs: Attrs
): PolymorphicComponent<Tag, FastOmit<Props, keyof Attrs>> {
  return (props) => Component(mergeProps(props, attrs) as never)
}
