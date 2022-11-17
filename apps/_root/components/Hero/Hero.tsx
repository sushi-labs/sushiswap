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
    <section className="relative">
      <Container maxWidth="5xl" className="mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_550px] flex justify-between gap-6">
          <div className="flex flex-col">
            <Typography variant="hero" weight={800} className="text-neutral-50 leading-[3.5rem]">
              Buy and Sell Instantly on Sushi. <span className="text-blue"> {TITLES[index]}.</span>
            </Typography>
            <Typography variant="lg" className="text-neutral-400 mt-3">
              No registration needed. Over 400 tokens to trade at your fingertips.
            </Typography>
            <div className="mt-10">
              <Search />
            </div>
          </div>
          <div className="hidden relative overflow-hidden lg:flex justify-end">
            <HeroSVG width={520} />
          </div>
        </div>
      </Container>
    </section>
  )
}
