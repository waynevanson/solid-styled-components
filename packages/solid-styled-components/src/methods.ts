import { mergeProps } from "solid-js"
import { Styleable, StyleableCallable, Substitute } from "./types"

export function contramap<PrevProps extends {}, NextProps extends {}>(
  target: Styleable<PrevProps>,
  contramap: (next: NextProps) => PrevProps
): StyleableCallable<NextProps> {
  return (...args) =>
    (next) =>
      target(...args)(contramap(next))
}

export function attrs<
  OuterProps extends {},
  AttrProps extends Partial<OuterProps>
>(
  target: StyleableCallable<OuterProps>,
  attrs: AttrProps
): StyleableCallable<Substitute<OuterProps, Partial<AttrProps>>> {
  return (...args) =>
    (next) =>
      target(...args)(mergeProps(attrs, next) as never)
}
