import { createContext, createMemo, JSX, useContext } from "solid-js"

export const ThemeContext = createContext({
  theme: undefined,
})

export interface ThemeProviderProps {
  theme: undefined
  children: JSX.Element
}

export function ThemeProvider(props: ThemeProviderProps) {
  const value = createMemo(() => ({ theme: props.theme }))
  return <ThemeContext.Provider value={value()} children={props.children} />
}

export function useTheme() {
  return useContext(ThemeContext)
}

export interface ThemeContext {
  readonly theme: unknown
}
