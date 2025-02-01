import { mergeProps } from "solid-js"
import { Styleable, StyleableCallable } from "./types"

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
): StyleableCallable<Omit<OuterProps, keyof AttrProps>> {
  return (...args) =>
    (next) =>
      target(...args)(mergeProps(next, attrs) as never)
}
