import { useInterval } from '@sushiswap/hooks'
import { Container, Typography } from '@sushiswap/ui'
import { HeroSVG } from 'components/SVG/HeroSVG'
import { FC, useState } from 'react'

import { Search } from './Search'

const TITLES = ['Whenever', 'Wherever', 'Whoever']

export const Hero: FC = () => {
  const [index, setIndex] = useState(0)

  useInterval(() => setIndex((prev) => (prev + 1) % 3), 1500)

  return (
    <section className="relative overflow-hidden">
      <Container maxWidth="5xl" className="mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="flex flex-col">
            <Typography variant="hero" weight={800} className="text-neutral-50 leading-[3.5rem]">
              Buy and Sell Instantly on Sushi.
            </Typography>
            <Typography variant="hero" weight={800} className="text-blue leading-[3.5rem]">
              {TITLES[index]}.
            </Typography>
            <Typography variant="lg" className="text-neutral-400 mt-3">
              No registration needed. Over 400 tokens to trade at your fingertips.
            </Typography>
            <div className="mt-10">
              <Search />
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroSVG width={420} height={312} />
          </div>
        </div>
      </Container>
    </section>
  )
}
