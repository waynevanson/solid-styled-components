import { Component } from "solid-js"

/**
 * @summary
 * Applies a function to change the signature of the component props.
 * @param Target Component
 * @param contramap A mapping function but in reverse.
 * @returns A component
 */
export function contramap<PrevProps extends {}, NextProps extends {}>(
  Target: Component<PrevProps>,
  contramap: (next: NextProps) => PrevProps
): Component<NextProps> {
  return (next) => <Target {...contramap(next)} />
}
