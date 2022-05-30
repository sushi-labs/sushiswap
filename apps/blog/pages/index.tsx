import { Button, Container, Typography } from '@sushiswap/ui'
import { Card } from 'components/Card'

export default function Blog() {
  return (
    <div className="flex flex-col divide-y divide-slate-800">
      <section className="bg-slate-800/30">
        <Container maxWidth="5xl" className="mx-auto px-4">
          <div className="flex flex-col py-20 gap-5 max-w-[500px]">
            <Typography variant="sm" className="text-slate-500">
              Latest From Sushi Blog <br />
              May 24, 2022
            </Typography>
            <Typography weight={700} variant="h2" className="text-slate-100">
              Launching Sushi&apos;s Suite of Defi Products on ALL Chains!
            </Typography>
            <Typography variant="xl" className="text-slate-400">
              Subheadings insert here. For example: If you don’t read this article, you are not gonna make it. If you
              read this article, you are gonna make it.
            </Typography>
            <div>
              <Button
                color="blue"
                className="transition-all hover:ring-4 focus:ring-4 text-sm sm:text-base text-slate-50 px-6 h-[44px] sm:!h-[44px] rounded-2xl"
              >
                Read Article
              </Button>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-10 pb-60">
        <Container maxWidth="5xl" className="mx-auto px-4 space-y-10">
          <div className="flex gap-2">
            <Button size="sm" color="blue" variant="outlined">
              All
            </Button>
            <Button size="sm" color="gray" variant="outlined">
              Tutorial
            </Button>
            <Button size="sm" color="gray" variant="outlined">
              Product
            </Button>
            <Button size="sm" color="gray" variant="outlined">
              Announcement
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card
              title="Launching Sushi’s Suite Of DeFi Products On ALL The Chains!"
              subtitle="        Subheadings insert here. For example: If you don’t read this article, you are not gonna make it.
"
              href="https://google.com"
            />
            <Card
              title="Launching Sushi’s Suite Of DeFi Products On ALL The Chains!"
              subtitle="        Subheadings insert here. For example: If you don’t read this article, you are not gonna make it.
"
              href="https://google.com"
            />
            <Card
              title="Launching Sushi’s Suite Of DeFi Products On ALL The Chains!"
              subtitle="        Subheadings insert here. For example: If you don’t read this article, you are not gonna make it.
"
              href="https://google.com"
            />
          </div>
        </Container>
      </section>
    </div>
  )
}
