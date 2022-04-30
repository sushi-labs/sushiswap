import { Glow, Container } from '@sushiswap/ui'

type Props = {
  children?: React.ReactNode
}

function Layout({ children }: Props) {
  return (
    <Container maxWidth="5xl" className="grid items-center justify-center w-screen h-screen mx-auto">
      <Glow>{children}</Glow>
    </Container>
  )
}

export default Layout
