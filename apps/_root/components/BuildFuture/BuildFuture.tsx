import { Container } from '@sushiswap/ui'
import React, { FC } from 'react'

import { AnimatedCards } from '../AnimatedCards'
import { AnimatedTitle } from '../AnimatedTitle/AnimatedTitle'
import { PRODUCT_CARDS } from '../data'

export const BuildFuture: FC = () => {
  return (
    <section className="py-20 sm:py-40 px-4">
      <Container maxWidth="5xl" className="mx-auto">
        <div className="flex flex-col gap-20">
          <AnimatedTitle className="text-left !max-w-full">
            Help Build <span className="text-pink">the future</span> with Sushi. <br />
            <span className="text-neutral-400">{`We invite all developers to explore Sushi's frameworks.`}</span>
          </AnimatedTitle>
          <AnimatedCards data={PRODUCT_CARDS} />
        </div>
      </Container>
    </section>
  )
}
