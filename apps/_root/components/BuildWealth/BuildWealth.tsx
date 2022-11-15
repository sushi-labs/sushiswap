import { ChevronRightIcon } from '@heroicons/react/solid'
import { Button, Container, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { AnimatedTitle } from '../AnimatedTitle/AnimatedTitle'

export const BuildWealth: FC = () => {
  return (
    <section className="py-20 sm:py-40 px-4">
      <Container maxWidth="5xl" className="mx-auto">
        <div className="flex flex-col gap-[120px]">
          <AnimatedTitle className="text-left">
            Build <span className="text-blue">wealth</span> with Sushi.{' '}
            <span className="text-neutral-400">{`It doesnt stop at trading.`}</span>
          </AnimatedTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col gap-2">
              <Typography variant="h3" weight={500}>
                Earn passive income with <br /> your coins.
              </Typography>
              <div className="flex gap-6">
                <Button
                  className="!p-0 mt-3"
                  size="md"
                  variant="empty"
                  endIcon={<ChevronRightIcon width={16} height={16} />}
                >
                  Provide Liquidity
                </Button>
                <Button
                  className="!p-0 mt-3"
                  size="md"
                  variant="empty"
                  endIcon={<ChevronRightIcon width={16} height={16} />}
                >
                  Farm Rewards
                </Button>
                <Button
                  className="!p-0 mt-3"
                  size="md"
                  variant="empty"
                  endIcon={<ChevronRightIcon width={16} height={16} />}
                >
                  Sushi Vault
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="h3" weight={500}>
                Use <b>Furo</b> to pay or get paid by streaming funds in real time.
              </Typography>
              <div className="flex gap-6">
                <Button
                  className="!p-0 mt-3"
                  size="md"
                  variant="empty"
                  endIcon={<ChevronRightIcon width={16} height={16} />}
                >
                  Pay Someone
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="h3" weight={500}>
                Let risk be under your control <br /> with <b>Kashi Lending</b>.
              </Typography>
              <div className="flex gap-6">
                <Button
                  className="!p-0 mt-3"
                  size="md"
                  variant="empty"
                  endIcon={<ChevronRightIcon width={16} height={16} />}
                >
                  Lend
                </Button>
                <Button
                  className="!p-0 mt-3"
                  size="md"
                  variant="empty"
                  endIcon={<ChevronRightIcon width={16} height={16} />}
                >
                  Borrow
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="h3" weight={500}>
                Be an early participant in the <br /> latest web3 projects with <b>Miso</b>.
              </Typography>
              <div className="flex gap-6">
                <Button
                  className="!p-0 mt-3"
                  size="md"
                  variant="empty"
                  endIcon={<ChevronRightIcon width={16} height={16} />}
                >
                  For Participants
                </Button>
                <Button
                  className="!p-0 mt-3"
                  size="md"
                  variant="empty"
                  endIcon={<ChevronRightIcon width={16} height={16} />}
                >
                  For founders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
