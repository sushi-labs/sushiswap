import { ChevronRightIcon } from '@heroicons/react/solid'
import { Button, Container, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { CustodyImage } from './CustodyImage'

export const Custody: FC = () => {
  return (
    <section className="py-60">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_380px] gap-[100px]">
          <CustodyImage />
          <div className="flex flex-col justify-center gap-3">
            <div className="flex flex-col items-center lg:items-start">
              <Typography variant="h1" weight={600} className="text-center lg:text-left">
                Your keys, your coins
              </Typography>
              <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2">
                As decentralized as it goes.
              </Typography>
              <Button className="!p-0 mt-3" variant="empty" endIcon={<ChevronRightIcon width={16} height={16} />}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
