import { Container } from '@sushiswap/ui'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Container maxWidth="md">{children}</Container>
}
