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

export function createClassName(
  props: { class?: string | undefined } | Record<string, any>,
  args: StyledArgs
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

  const [identifier, identifierSet] = createSignal("")

  createEffect(() => {
    identifierSet(css.apply(context(), args as never))
  })

  const className = createMemo(() =>
    [classNameFromProps(), identifier()].filter(Boolean).join(" ")
  )

  return className
}
