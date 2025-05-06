import { Button } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import { motion } from 'framer-motion'
import React, { type FC } from 'react'

import { ExpandableCard } from './ExpandableCard'
import { BentoBoxSVG, SwitchSVG } from './svgs'

const DATA = [
  {
    caption: 'For Developers',
    category: 'Sushi Token Vault',
    title: 'The interest-bearing DeFi base layer',
    icon: BentoBoxSVG,
    content: (
      <>
        <h3>What’s Sushi Token Vault? What’s In The Box For You?</h3>
        <p>
          Sushi Token Vault is an underlying token vault that provides a range
          of benefits for anything built on top of it. The main idea is to
          provide extra yield on top of a large pool of tokens via simple, safe
          strategies per token in the vault. It keeps an artificial balance
          internally of each account, allowing for the funds to be used in
          multiple ways at once, including flash loans (0.05% fee in the users’
          pocket).
        </p>
        <p>
          Sushi Token Vault allows for a simplified token approval process (each
          approval is inherited by the system), a minimal proxy factory contract
          for convenience, optimized deposit, withdraw and skim functions that
          auto convert ETH to WETH, the batching of multiple Sushi Token Vault
          functions into a single transaction, and so much more, all while
          improving capital efficiency with increased use.
        </p>
      </>
    ),
    link: 'https://docs.sushi.com/docs/Products/Bentobox',
    linkText: 'Visit Docs',
  },
  {
    caption: 'For Developers',
    category: 'Trident AMM',
    title: 'A future-proof framework for building AMMs',
    icon: SwitchSVG,
    content: (
      <>
        <h3>Benefits Of Learning Trident?</h3>
        <p>
          Trident is an AMM production framework that can be used to quickly
          iterate over and develop custom AMMs on top of. As most AMMs currently
          hardcode their environments, they all have the same underlying
          methods; we have abstracted these methods into a single interface,
          called IPool. Using the IPool interface and simply extending it to any
          number of pools, developers can quickly and efficiently engineer high
          volume pools of different types, earning on the fees.
        </p>
        <p>
          Currently, Classic Pools (traditional pool model) and Stable Pools
          (for trading like-kind assets) are supported pool types, with more on
          the way. Any pool type that passes an audit and an internal review are
          eligible to be whitelisted on Trident, allowing external developers to
          create custom types if they wish.
        </p>
      </>
    ),
    link: 'https://docs.sushi.com/docs/Products/Trident%20AMM%20Framework',
    linkText: 'Visit Docs',
  },
]

export const BuildFuture: FC = () => {
  return (
    <section className="px-4 py-20 sm:py-40">
      <Container maxWidth="5xl" className="mx-auto">
        <div className="prose dark:prose-invert mx-auto text-center flex flex-col">
          <h1>
            Help build <span className="text-pink">the future</span> with Sushi.{' '}
          </h1>
          <h5>
            We extend a warm invitation to all developers, innovators, and
            visionaries to delve into the intricate frameworks that power Sushi.
            Our doors are open for you to unravel the possibilities, tap into
            the potentials, and reshape the future of decentralized finance.
          </h5>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-20">
          {DATA.map(
            ({
              caption,
              title,
              content,
              link,
              linkText,
              icon: Icon,
              category,
            }) => (
              <ExpandableCard
                key={title}
                caption={caption}
                title={title}
                content={content}
                link={link}
                linkText={linkText}
              >
                {({ setOpen, containerId, titleId }) => (
                  <div
                    className="relative h-[285px] flex flex-grow"
                    onClick={() => setOpen(true)}
                    onKeyDown={() => setOpen(true)}
                  >
                    <div className="w-full h-full relative block pointer-events-none hover:scale-[1.02] transition-all">
                      <motion.div
                        className="relative bg-secondary pointer-events-auto rounded-[20px] overflow-hidden w-full h-full m-[0_auto] cursor-pointer"
                        layoutId={containerId}
                      >
                        <motion.div
                          animate
                          className="absolute top-[30px] left-[30px] max-w-[300px] flex flex-col gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              width={40}
                              height={40}
                              className="opacity-1"
                            />
                            <span className="font-medium text-muted-foreground">
                              {category}
                            </span>
                          </div>
                          <motion.h1
                            layoutId={titleId}
                            className="text-3xl font-semibold text-left"
                          >
                            {title}
                          </motion.h1>
                          <div>
                            <Button variant="secondary">View More</Button>
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </ExpandableCard>
            ),
          )}
        </div>
      </Container>
    </section>
  )
}
