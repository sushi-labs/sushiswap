import { Button } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import { motion } from 'framer-motion'
import type { FC } from 'react'

import { ExpandableCard, type ExpendableCardData } from '../../expandable-card'
import { GuardImage } from './guard-image'

const DATA: ExpendableCardData = {
  title: 'Keep more profts and earn gas refunds',
  caption: 'For Retail Users',
  content: (
    <>
      <p>
        SushiGuard is a way of protecting Sushi users from a predatory process
        known as MEV. MEV stands for “Maximal Extractable Value” and in essence
        plays the same role in web3 as arbitrage trading does in traditional
        finance. Automated bots will monitor the network and “sandwich” your
        trades by reordering transactions in a block, leaving users with a
        less-optimal trade than they originally thought.
      </p>
      <p>
        SushiGuard can easily be toggled on in the swap interface for trades,
        giving users the ability to protect their trades from these “sandwich
        attacks” and refund an amount of the gas fees to users that they spent
        to make the trade, improving the experience and saving them money.
      </p>
    </>
  ),
  link: 'https://manifoldfinance.com',
  linkText: 'Visit Manifold',
}

export const Guard: FC = () => {
  return (
    <section className="py-20 sm:py-40">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-center gap-x-[100px] gap-y-[40px]">
          <div>
            <GuardImage />
          </div>
          <div className="flex flex-col justify-center gap-3">
            <ExpandableCard
              title={DATA.title}
              caption={DATA.caption}
              content={DATA.content}
              link={DATA.link}
              linkText={DATA.linkText}
            >
              {({ setOpen, containerId, titleId }) => (
                <motion.div
                  layoutId={containerId}
                  className="flex flex-col items-center lg:items-start"
                >
                  <motion.h1
                    layoutId={titleId}
                    className="text-4xl font-semibold flex flex-col items-center lg:items-start text-center lg:text-left"
                  >
                    {DATA.title}
                  </motion.h1>
                  <span className="text-lg text-center lg:text-left mt-2 mb-3">
                    Enable SushiGuard and earn gas refunds on all of your
                    transactions.
                  </span>
                  <Button onClick={() => setOpen(true)} variant="secondary">
                    Learn More
                  </Button>
                </motion.div>
              )}
            </ExpandableCard>
          </div>
        </div>
      </Container>
    </section>
  )
}
