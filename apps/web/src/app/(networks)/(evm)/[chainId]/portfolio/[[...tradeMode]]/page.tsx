import { Container } from '@sushiswap/ui'
import { PortfolioPage } from '../_ui/portfolio-page'

export default function Portfolio() {
  return (
    <main className="lg:p-4 md:p-2 pt-9 mb-6 animate-slide dark:bg-background bg-background">
      <Container
        maxWidth="screen-2xl"
        className="flex flex-col gap-6 px-4 md:pt-6"
      >
        <PortfolioPage />
      </Container>
    </main>
  )
}
