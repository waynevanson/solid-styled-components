import { createSignal } from "solid-js"
import { styled } from "solid-styled-components"

const Container = styled.div`
  display: flex;
  gap: 2rem;
  background-color: pink;
  padding: 2rem;
  justify-content: space-evenly;
`

const Paragraph = styled.p`
  padding: 1rem;
`

const Button = styled.button`
  padding: 0.5rem;
`

const Box = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.colour};
`

function App() {
  const [person, personSet] = createSignal(false)
  const [colour, colourSet] = createSignal(false)

  return (
    <Container>
      <Paragraph>Hello, {person() ? "World" : "Earth"}!</Paragraph>
      <Button onclick={() => personSet((boolean) => !boolean)}>
        Toggle person!
      </Button>

      <Button onclick={() => colourSet((a) => !a)}>Toggle colour</Button>

      <Box colour={colour() ? "salmon" : "grey"}>I'm coloured!</Box>
    </Container>
  )
}

export default App
