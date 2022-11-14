import { useInterval } from '@sushiswap/hooks'
import { Container, Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { HeroSVG } from '../SVG/HeroSVG'
import { Search } from './Search'

const TITLES = ['Whenever', 'Wherever', 'Whoever']

export const Hero: FC = () => {
  const [index, setIndex] = useState(0)

  useInterval(() => setIndex((prev) => (prev + 1) % 3), 1500)

  return (
    <section>
      <Container maxWidth="5xl" className="mx-auto px-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <Typography variant="h1" weight={800} className="text-slate-50">
              Buy and Sell Any Crypto Instantly on Sushi.
            </Typography>
            <Typography variant="h1" weight={700} className="text-blue">
              {TITLES[index]}.
            </Typography>
            <Typography className="text-slate-400 mt-3">
              No registration needed. Over 400 tokens to trade at your fingertips.
            </Typography>
            <div className="mt-10">
              <Search />
            </div>
          </div>
          <div className="">
            <HeroSVG width={496} height={312} />
          </div>
        </div>
      </Container>
    </section>
  )
}
