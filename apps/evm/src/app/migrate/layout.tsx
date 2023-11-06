import { Container, typographyVariants } from '@sushiswap/ui'
import { BackButton } from 'src/ui/pool/BackButton'

export const metadata = {
  title: 'SushiMigrate 🍣',
}

export default function MigrateLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Container maxWidth="5xl" className="py-10 px-4">
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center gap-3">
            <BackButton
              variant="ghost"
              name="back"
              className="xl:absolute xl:ml-[-56px]"
            />
            <h1 className={typographyVariants({ variant: 'h3' })}>Migrate</h1>
          </div>
          <p className={typographyVariants({ variant: 'muted' })}>
            Migrate your liquidity to SushiSwap.
          </p>
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
          <Container maxWidth="5xl" className="px-4">
            {children}
          </Container>
        </div>
      </section>
    </>
  )
}
