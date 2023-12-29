import { Container } from '@sushiswap/ui'
import { BarHeader } from 'src/ui/bar'

export const metadata = {
  title: 'SushiBar 💦',
}

export default async function Layout({
  children,
}: { children: React.ReactNode; params: { id: string } }) {
  return (
    <>
      <Container maxWidth="5xl" className="px-4 pt-16 mb-12">
        <BarHeader />
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-9 pb-20 h-full">
          {children}
        </div>
      </section>
    </>
  )
}
