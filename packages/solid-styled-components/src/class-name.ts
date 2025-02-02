import { css } from "goober"
import { createEffect, createMemo, createSignal } from "solid-js"
import { StyledArgs } from "./types"

type GooberFlags =
  | {
      /**
       * @summary
       * Pushes the stylesheet to global context, without a class name.
       */
      g: boolean
    }
  | {
      /**
       * @summary
       * Create an identifier for keyframes.
       */
      k: boolean
    }

type GooberContext = (GooberFlags | {}) & {
  /**
   * @summary
   * The target element.
   */
  t?: unknown

  /**
   * @summary
   * Props that are used the css contains functions.
   */
  p?: unknown

  /**
   * @summary
   * Appends the styles to the existing stylesheet, rather than creating a new one.
   * Use this when there is already a class in the url.
   */
  o?: boolean
}

const GOOBER_CLASS_REGEXP = /^go[0-9]+/

/**
 * @summary
 * Creates a new className property from a possibly existing className,
 * props and all style parameters that goober supports.
 *
 * @param props Props that include the theme
 * @param allArgs
 * @returns
 */
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
