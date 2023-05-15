import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { Button, Container, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { MoveImage } from './MoveImage'

export const Move: FC = () => {
  return (
    <section className="py-20 sm:py-40">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_auto] justify-center gap-x-[100px] gap-y-[20px]">
          <div className="order-2 lg:order-1 flex flex-col justify-center gap-3">
            <div className="flex flex-col items-center lg:items-start">
              <Typography variant="h1" weight={600} className="text-center lg:text-left">
                Move assets across networks in seconds.
              </Typography>
              <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2">
                We will always find you the best rate, no matter what network you’re on, with no extra fees.
              </Typography>
              <div className="flex gap-6">
                <Button
                  as="a"
                  target="_blank"
                  href="https://www.sushi.com/xswap"
                  className="!p-0 mt-3"
                  variant="empty"
                  endIcon={<ExternalLinkIcon width={16} height={16} />}
                >
                  Visit xSwap
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
