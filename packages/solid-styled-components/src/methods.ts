import { mergeProps } from "solid-js"
import { StyleableCallable } from "./types"

export function contramap<PrevProps extends {}, NextProps extends {}>(
  target: StyleableCallable<PrevProps>,
  contramap: (next: NextProps) => PrevProps
): StyleableCallable<NextProps> {
  return (...style) =>
    (next) =>
      //@ts-expect-error
      target(...style)(contramap(next))
}

// use contramap
export function attrs<
  OuterProps extends {},
  AttrProps extends Partial<OuterProps>
>(
  target: StyleableCallable<OuterProps>,
  attrs: AttrProps | ((props: OuterProps) => AttrProps)
): StyleableCallable<Omit<OuterProps, keyof AttrProps>> {
  return contramap(
    target,
    (props) =>
      mergeProps(
        props,
        typeof attrs === "function" ? attrs(props as never) : attrs
      ) as never
  )
}

// Component(props) -> (() => Component(props))

// could pass the ...styles via props?
