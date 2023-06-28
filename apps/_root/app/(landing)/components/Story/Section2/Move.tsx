import { Button } from '@sushiswap/ui/components/button'
import { Container } from '@sushiswap/ui/components/container'
import { FC } from 'react'

import { MoveImage } from './MoveImage'

export const Move: FC = () => {
  return (
    <section className="py-20 sm:py-40">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_auto] justify-center gap-x-[100px] gap-y-[20px]">
          <div className="order-2 lg:order-1 flex flex-col justify-center gap-3">
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-4xl font-semibold text-center lg:text-left">
                Move assets across networks in seconds.
              </span>
              <span className="text-lg text-center lg:text-left mt-2">
                We will always find you the best rate, no matter what network you’re on, with no extra fees.
              </span>
              <div className="flex gap-6 mt-3">
                <Button asChild variant="secondary">
                  <a target="_blank" href="https://www.sushi.com/xswap" rel="noreferrer">
                    Visit xSwap
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <MoveImage />
          </div>
        </div>
      </Container>
    </section>
  )
}
