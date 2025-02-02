import { mergeProps } from "solid-js"
import { FastOmit, StyleableCallable } from "./types"

/**
 * @summary
 * Applies a function to change the signature of the component props.
 * @param target Styleable
 * @param contramap
 * @returns
 */
export function contramap<PrevProps extends {}, NextProps extends {}>(
  target: StyleableCallable<PrevProps>,
  contramap: (next: NextProps) => PrevProps
): StyleableCallable<NextProps> {
  return (...style) =>
    (next) =>
      target(...(style as any))(contramap(next))
}

export function attrs<
  OuterProps extends {},
  AttrProps extends Partial<OuterProps>
>(
  target: StyleableCallable<OuterProps>,
  attrs: AttrProps | ((props: OuterProps) => AttrProps)
): StyleableCallable<FastOmit<OuterProps, keyof AttrProps>> {
  return contramap(
    target,
    (props) =>
      mergeProps(
        props,
        typeof attrs === "function" ? attrs(props as never) : attrs
      ) as never
  )
}
