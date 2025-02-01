import { css } from "goober"
import { createEffect, createMemo, createSignal } from "solid-js"
import { StyledArgs } from "./types"

type GooberFlags = { g: boolean } | { k: boolean } | {}

type GooberContext = GooberFlags & {
  // Target element
  t?: unknown
  // Props from template literals
  p?: unknown

  o?: boolean
}

const GOOBER_CLASS_REGEXP = /^go[0-9]+/

export function createClassName<ThemedProps>(
  props: { class?: string | undefined } & ThemedProps,
  allArgs: ReadonlyArray<StyledArgs<ThemedProps>>
) {
  const classNameFromProps = createMemo(
    () => ("class" in props && props.class) || ""
  )

  const context = createMemo(
    (): GooberContext => ({
      // append
      o: GOOBER_CLASS_REGEXP.test(classNameFromProps()),
      p: props,
    })
  )

  const [identifiers, identifiersSet] = createSignal(new Set())

  createEffect(() => {
    const classNames = allArgs.map((args) => css.apply(context, args as never))
    identifiersSet(new Set(classNames))
  })

  const className = createMemo(() =>
    [classNameFromProps(), Array.from(identifiers())].filter(Boolean).join(" ")
  )

  return className
}
