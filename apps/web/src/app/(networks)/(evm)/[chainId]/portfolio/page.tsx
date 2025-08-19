import { Container } from '@sushiswap/ui'
import { TablesView } from 'src/ui/portfolio/tables-view/tables-view'
//@dev keep this a SSR page
export default function PortfolioPage() {
  return (
    <main className="lg:p-4 md:p-2 pt-9 md:mb-[86px] animate-slide bg-white dark:bg-background md:bg-background">
      <Container maxWidth="screen-2xl" className="px-4">
        <TablesView />
      </Container>
    </main>
  )
}
