import { Container, typographyVariants } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { BackButton } from 'src/ui/pool/BackButton'

export const metadata: Metadata = {
  title: 'Create Pool 💦',
}

export default function CreatePoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Container maxWidth="2xl" className="py-10 px-4">
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
            Create a new pool or add liquidity to an existing pool on Stellar
          </p>
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
          <Container maxWidth="2xl" className="px-4">
            {children}
          </Container>
        </div>
      </section>
    </>
  )
}

