import { JSX } from "solid-js"
import { PolymorphicComponent, tag } from "./tag.jsx"
import { StyledArgs, styler } from "./style.jsx"
import { contramap } from "./contramap.jsx"

export function createStyleable<
  Tag extends keyof JSX.IntrinsicElements,
  Props extends Record<string, any>
>(
  component: PolymorphicComponent<Tag, Props>
): (
  ...style: StyledArgs<JSX.IntrinsicElements[Tag]>
) => PolymorphicComponent<Tag, Props>

export function createStyleable<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag
): (
  ...style: StyledArgs<JSX.IntrinsicElements[Tag]>
) => PolymorphicComponent<Tag, JSX.IntrinsicElements[Tag]>

export function createStyleable<
  Tag extends keyof JSX.IntrinsicElements,
  Props extends Record<string, any>
>(tagOrComponent: Tag | PolymorphicComponent<Tag, Props>) {
  const Component = () =>
    typeof tagOrComponent === "string" ? tag(tagOrComponent) : tagOrComponent

  return (...styles: StyledArgs<Props>) => styler(Component(), styles)
}

export interface StyleableApply<
  Tag extends keyof JSX.IntrinsicElements,
  Props extends Record<string, any>
> {
  (...style: StyledArgs<JSX.IntrinsicElements[Tag]>): PolymorphicComponent<
    Tag,
    Props
  >
}

export interface StyleableBound<
  Tag extends keyof JSX.IntrinsicElements,
  Props extends Record<string, any>
> {
  contramap<NextProps extends Record<string, any>>(
    fn: (next: NextProps) => Props
  ): Styleable<Tag, Props>
}

export interface Styleable<
  Tag extends keyof JSX.IntrinsicElements,
  Props extends Record<string, any>
> extends StyleableApply<Tag, Props>,
    StyleableBound<Tag, Props> {}

export type StyledTag = {
  [Tag in keyof JSX.IntrinsicElements]: Styleable<
    Tag,
    JSX.IntrinsicElements[Tag]
  >
}

export interface StyledApply {
  <Tag extends keyof JSX.IntrinsicElements>(tag: Tag): Styleable<
    Tag,
    JSX.IntrinsicElements[Tag]
  >
}

export interface Styled extends StyledTag, StyledApply {}

function bind<
  Tag extends keyof JSX.IntrinsicElements,
  Props extends Record<string, any>
>(styleable: StyleableApply<Tag, Props>): Styleable<Tag, Props> {
  //@ts-ignore
  return Object.assign(styleable, {
    contramap<NextProps extends Record<string, any>>(
      fn: (next: NextProps) => Props
    ): Styleable<Tag, NextProps> {
      return bind((...styles) => contramap(styleable(...styles), fn))
    },
  })
}

export const styled = new Proxy(createStyleable as Styled, {
  get(target, property) {
    const styleable = target(property as any)

    return bind(styleable)
  },
})
