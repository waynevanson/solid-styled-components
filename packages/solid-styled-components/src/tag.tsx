import { Component, ComponentProps, JSX } from "solid-js"
import { Dynamic } from "solid-js/web"

export function tag<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag
): Component<ComponentProps<Tag>> {
  return (props: ComponentProps<Tag>) => <Dynamic component={tag} {...props} />
}
