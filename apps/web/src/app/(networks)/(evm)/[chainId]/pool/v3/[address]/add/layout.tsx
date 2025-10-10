import { Container } from '@sushiswap/ui'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="flex flex-col flex-1">
        <div className="pt-4 pb-10 h-full">
          <Container maxWidth="6xl" className="px-4">
            {children}
          </Container>
        </div>
      </section>
    </>
  )
}
