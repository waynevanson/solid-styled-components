import { mergeProps } from "solid-js"
import { styled } from "./src/index.jsx"
import { render } from "solid-js/web"

const A = styled.p.contramap((a) => mergeProps(a, { children: "Sup bro!" }))`
  color: red;
`

render(() => <A />, document.body)
