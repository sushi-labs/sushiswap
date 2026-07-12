import { Container } from '@sushiswap/ui'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="7xl" className="py-16 px-40 overflow-y-auto">
      {children}
    </Container>
  )
}
