import { Container } from '@sushiswap/ui'

export const metadata = {
  title: 'Pool 💦',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Container maxWidth="7xl">{children}</Container>
}
