import { Container } from '@sushiswap/ui'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="5xl" className="py-10 px-4">
      <section>{children}</section>
    </Container>
  )
}
