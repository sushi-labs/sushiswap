import { Container } from '@sushiswap/ui'
import { BackButton } from 'src/app/(networks)/_ui/back-button'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container maxWidth="7xl" className="pt-6 px-4">
        <div className="flex flex-col gap-4">
          <div>
            <BackButton />
          </div>

          <div className="flex flex-col gap-1 mb-2">
            <h1 className="text-3xl md:text-4xl font-medium">Add Liquidity</h1>
            <h2 className="md:text-lg text-muted-foreground">
              Create a new pool or add liquidity to an existing one.
            </h2>
          </div>
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <Container maxWidth="7xl" className="px-4 pb-10 md:pt-10 pt-5">
          {children}
        </Container>
      </section>
    </>
  )
}
