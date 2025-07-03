import { Container, typographyVariants } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { BackButton } from 'src/ui/pool/BackButton'
import { Header } from '~kadena/header'
import { PoolProvider } from '~kadena/pool/pool-provider'

export const metadata: Metadata = {
  title: 'Pool 💦',
}

export default function CreatePositionLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Header className="mb-[56px]" />
      <Container maxWidth="5xl" className="pb-2 pt-[36px] px-4">
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center gap-3">
            <BackButton
              variant="ghost"
              name="back"
              className="xl:absolute xl:ml-[-56px]"
            />
            <h1 className={typographyVariants({ variant: 'h3' })}>
              Add Liquidity
            </h1>
          </div>
          <p className={typographyVariants({ variant: 'muted' })}>
            Create a new pool or create a liquidity position on an existing
            pool.
          </p>
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
          <Container maxWidth="5xl" className="px-4">
            <PoolProvider>{children}</PoolProvider>
          </Container>
        </div>
      </section>
    </>
  )
}
