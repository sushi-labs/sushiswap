import { Container, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { AnimatedTitle } from '../AnimatedTitle/AnimatedTitle'
import { PacmanSVG } from '../SVG/PacmanSVG'

export const BuildWealth: FC = () => {
  return (
    <section className="py-60">
      <Container maxWidth="5xl" className="mx-auto">
        <div className="flex flex-col gap-20">
          <AnimatedTitle className="text-left">
            Build <span className="text-blue">wealth</span> with Sushi.{' '}
            <span className="text-slate-400">{`It doesnt stop at trading.`}</span>
          </AnimatedTitle>
          <div className="grid grid-cols-2 items-center">
            <div className="flex flex-col gap-6">
              <Typography variant="h3" weight={600}>
                Earn passive income with <br /> your coins.
              </Typography>
              <div className="flex gap-6">
                <Typography variant="lg" weight={600}>
                  Liquidity Pool
                </Typography>
                <Typography variant="lg" weight={600}>
                  Yield Farm
                </Typography>
                <Typography variant="lg" weight={600}>
                  Sushi Vault
                </Typography>
              </div>
            </div>
            <PacmanSVG />
          </div>
        </div>
      </Container>
    </section>
  )
}
