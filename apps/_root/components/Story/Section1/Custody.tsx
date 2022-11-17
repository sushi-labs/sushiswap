import { ChevronRightIcon } from '@heroicons/react/solid'
import { Button, Container, Typography } from '@sushiswap/ui'
import { motion } from 'framer-motion'
import { FC } from 'react'

import { ExpandableCard, ExpendableCardData } from '../../ExpandableCard/ExpandableCard'
import { CustodyImage } from './CustodyImage'

const DATA: ExpendableCardData = {
  title: 'Your keys, your coins',
  caption: 'For Retail Users',
  content: (
    <>
      <h3>What is OpenMEV?</h3>
      <p>
        OpenMEV aims to provide a credible neutral platform for facilitating both aggregation and direct communication
        channels between block validators, block producers and block synchronizers for the Ethereum and EVM-based
        networks.
      </p>
      <p>Example use cases include:</p>
      <ul>
        <li>Users that would like to communicate their preferred transaction order within a block.</li>
        <li>Account abstraction via private mempool </li>
      </ul>
      <p>
        OpenMEV is built on top of SecureRPC. SecureRPC provides users with an accessible, convenient and secure
        infrastructure for transaction routing and execution.
      </p>
      <ul>
        <li>Accessible: allow ordinary users to easily discover the trading risk and value on the network.</li>
        <li>
          Convenient: enable backrunning swaps automatically so that more opportunities to capture profits at a lower
          cost.
        </li>
        <li>Secure: make transactions on the blockchain network more secure and private.</li>
      </ul>
    </>
  ),
  link: 'https://manifoldfinance.com',
  linkText: 'Visit Manifold',
}

export const Custody: FC = () => {
  return (
    <section className="py-20 sm:py-40">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-center gap-[100px]">
          <CustodyImage />
          <div className="flex flex-col justify-center gap-3">
            <ExpandableCard
              title={DATA.title}
              caption={DATA.caption}
              content={DATA.content}
              link={DATA.link}
              linkText={DATA.linkText}
            >
              {({ setOpen, containerId, titleId }) => (
                <motion.div layoutId={containerId} className="flex flex-col items-center lg:items-start">
                  <Typography
                    as={motion.h1}
                    layoutId={titleId}
                    variant="h1"
                    weight={600}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left"
                  >
                    {DATA.title}
                  </Typography>
                  <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2">
                    Own your own crypto, just like cash in your wallet. Fully decentralized & self custody of your funds
                    means your money in your wallet, as it should be.
                  </Typography>
                  <Button
                    onClick={() => setOpen(true)}
                    className="!p-0 mt-3"
                    variant="empty"
                    endIcon={<ChevronRightIcon width={16} height={16} />}
                  >
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
