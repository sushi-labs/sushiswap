import { Container } from '@sushiswap/ui'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="lg" className="pt-16">
      {children}
    </Container>
  )
}
