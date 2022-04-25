import { FC } from 'react'
import Container from 'ui/container/Container'
import Glow from 'ui/glow/Glow'

const Layout: FC = ({ children }) => {
  return (
    <Container maxWidth="5xl" className="lg:mx-auto px-2">
      <Glow>{children}</Glow>
    </Container>
  )
}

export default Layout
