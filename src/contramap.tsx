import { JSX } from "solid-js"
import { PolymorphicComponent } from "./tag"

/**
 * @summary
 * Applies a function to change the signature of the component props.
 * @param Target Component
 * @param contramap A mapping function but in reverse.
 * @returns A component
 */
export function contramap<
  Tag extends keyof JSX.IntrinsicElements,
  PrevProps extends {},
  NextProps extends {}
>(
  Target: PolymorphicComponent<Tag, PrevProps>,
  contramap: (next: NextProps) => PrevProps
): PolymorphicComponent<Tag, NextProps> {
  //@ts-ignore
  return (next) => <Target {...contramap(next)} />
}
