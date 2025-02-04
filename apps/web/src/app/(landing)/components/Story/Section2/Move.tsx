import { LinkInternal } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import type { FC } from 'react'

import { MoveImage } from './MoveImage'

export const Move: FC = () => {
  return (
    <section className="py-20 sm:py-40">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_auto] justify-center gap-x-[100px] gap-y-[20px]">
          <div className="order-2 lg:order-1 flex flex-col justify-center gap-3">
            <div className="flex flex-col items-center lg:items-start prose dark:prose-invert">
              <h1 className="text-center lg:text-left">
                Move assets across networks in seconds.
              </h1>
              <h5 className="text-center lg:text-left mb-8">
                We will always find you the best rate, no matter what network
                you’re on, with no extra fees.
              </h5>
              <div className="flex gap-6">
                <LinkInternal href="/cross-chain">
                  <Button asChild variant="secondary">
                    Visit xSwap
                  </Button>
                </LinkInternal>
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
