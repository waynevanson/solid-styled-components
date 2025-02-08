import { css } from "goober"
import { createEffect, createMemo, createSignal, mergeProps } from "solid-js"
import { StyledArgs } from "./style"
import { useTheme } from "./theme"

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
 * @param styles
 * @returns
 */
export function createClassName<Props extends Record<string, any>>(
  props: Props,
  styles: StyledArgs<Props>
) {
  const theme = useTheme()

  const classNameFromProps = createMemo(
    () => ("class" in props && (props.class as string)) || ""
  )

  const context = createMemo(
    (): GooberContext => ({
      // append mode when we're there already exists a goober class.
      o: GOOBER_CLASS_REGEXP.test(classNameFromProps()),
      // provide style access to the theme.
      p: mergeProps(props, { theme }),
    })
  )

  // add styles to a stylesheet created from Goober,
  // returning class created for styles.
  const [classNameFromGoober, classNameFromGooberSet] = createSignal("")
  createEffect(() => {
    const className = css.apply(context, styles as never)
    classNameFromGooberSet(className)
  })

  // Create class by appending the previous class name with the new class name.
  const className = createMemo(() =>
    [classNameFromProps(), classNameFromGoober()].filter(Boolean).join(" ")
  )

  return className
}
