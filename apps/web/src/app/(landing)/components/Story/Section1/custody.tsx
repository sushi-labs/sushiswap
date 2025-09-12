import { Button } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import { motion } from 'framer-motion'
import type { FC } from 'react'

import { ExpandableCard, type ExpendableCardData } from '../../expandable-card'
import { CustodyImage } from './custody-image'

const DATA: ExpendableCardData = {
  title: 'Your keys, your coins',
  caption: 'For Retail Users',
  content: (
    <>
      <p>
        Centralized exchanges, or exchanges run by a centralized entity, custody
        users’ tokens on their behalf into an intermediary account, and are
        prone to many attack vectors such as hacks, government intervention,
        internal mismanagement, frozen withdrawals, bank runs, etc. Due to the
        unfortunate prevalence of these issues with users’ funds on centralized
        exchanges, the space had adopted a common mantra: “Not your keys, not
        your crypto.” This refers to the idea that if you yourself do not have
        the literal custody of your funds (because a third party is looking over
        them for you), you can never be completely sure your funds are safe.
      </p>
      <p>
        As a decentralized exchange, Sushi never has control of users’ funds,
        nor will they ever in the future. The decentralized nature of it means
        that we do not rely on a third party or an intermediary account; the
        users are always in full custody of your their tokens, and can exchange
        with them at any time, without ever having to jump through any hoops or
        submit any personal information. Stay in full control of your money.
      </p>
    </>
  ),
  link: 'https://www.sushi.com/swap',
  linkText: 'Visit Swap',
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
                <motion.div
                  layoutId={containerId}
                  className="prose dark:prose-invert flex flex-col items-center lg:items-start"
                >
                  <motion.h1
                    layoutId={titleId}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left"
                  >
                    {DATA.title}
                  </motion.h1>
                  <h5 className="text-lg text-center lg:text-left mb-8">
                    Own your own crypto, just like cash in your wallet. Fully
                    decentralized & self custody of your funds means your money
                    in your wallet, as it should be.
                  </h5>
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
