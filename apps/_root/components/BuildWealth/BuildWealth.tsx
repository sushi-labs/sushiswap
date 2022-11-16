import { ChevronRightIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import { Button, Container, Link, Typography } from '@sushiswap/ui'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import React, { FC, ReactNode, useState } from 'react'

import { AnimatedTitle } from '../AnimatedTitle/AnimatedTitle'
import { NetworkStellarSVG } from '../SVG/NetworkStellarSVG'

export const BuildWealth: FC = () => {
  return (
    <section className="py-20 sm:py-40 px-4">
      <Container maxWidth="5xl" className="mx-auto">
        <div className="flex flex-col gap-[120px]">
          <AnimatedTitle className="text-center !max-w-full">
            Build <span className="text-blue">wealth</span> with Sushi. <br />
            <span className="text-neutral-400">{`It doesnt stop at trading.`}</span>
          </AnimatedTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <NetworkStellarSVG />
            <div className="flex flex-col items-center md:items-start">
              <Typography variant="h3" weight={600} className="text-center md:text-left">
                Earn passive income with <br /> your coins.
              </Typography>
              <div className="flex flex-wrap gap-x-6">
                <BuildWealthExplainer
                  audience="Retail Users"
                  id="provide"
                  title="Provide Liquidity"
                  content={
                    <>
                      <h3>What Is A Liquidity Pool? How Does It Earn You Yield?</h3>
                      <p>
                        A liquidity pool is a place where users can “pool” their assets into, which is used for
                        facilitating trades on an automated market maker (AMM), such as Sushi.
                      </p>
                      <h3>Decentralized Liquidity</h3>
                      <p>
                        AMMs use liquidity pools to crowdsource liquidity in a permissionless and decentralized way,
                        allowing their users to make quick and easy trades on the platform without ever needing
                        traditional market makers or order books to match sellers and buyers.
                      </p>
                      <h3>Liquidity Provider</h3>
                      <p>
                        Each pool correlates to a pair of assets; for providing their liquidity into the pool, users
                        receive a percentage of every trade made using that pair and receive an amount of liquidity
                        provider (LP) tokens as well, which can then be used to accrue more yield in a farm.
                      </p>
                    </>
                  }
                  link="https://sushi.com/earn"
                  linkText="Visit Earn"
                />
                <BuildWealthExplainer
                  audience="Retail Users"
                  id="farm"
                  title="Farm Rewards"
                  content={
                    <>
                      <h3>What Is A Yield Farm? How Does It Earn You Yield?</h3>
                      <p>
                        Yield farms are a way for users to make even more yield for loaning their assets out to an
                        Automated Market Maker (AMM), such as Sushi.
                      </p>
                      <h3>Deposit your LP Tokens</h3>
                      <p>
                        Users can deposit their liquidity provider (LP) tokens that they receive from depositing
                        (commonly known as “staking”) their assets in a liquidity pool into a yield farm, which offers
                        extra rewards and incentives for certain pairs.
                      </p>
                      <h3>Yield on Yield</h3>
                      <p>
                        Users can therefore earn yield not only on swap fees from the original assets loaned to the
                        pool, but they can also earn even more yield on top by then placing their LP tokens into a farm.
                      </p>
                    </>
                  }
                  link="https://sushi.com/earn"
                  linkText="Visit Earn"
                />
                <BuildWealthExplainer
                  id="vault"
                  audience="Retail Users"
                  title="Sushi Vault"
                  content={
                    <>
                      <h3>What Is The Sushi Vault? How Does It Earn You Yield?</h3>
                      <p>
                        The Sushi Vault (previously known as the BentoBox) is a token vault that underlies the entirety
                        of the product suite at Sushi.
                      </p>
                      <h3>Automatic Yield</h3>
                      <p>
                        The purpose of the vault is to accrue more yield for users automatically, without them having to
                        do anything at all. It works by recording artificial balances for users that choose to deposit
                        into it, enabling the funds in there to be actionable in multiple ways to earn extra yield at
                        the same time, namely low risk farming strategies and flash loans.
                      </p>
                      <h3>Save Money</h3>
                      <p>
                        Having all of the funds in an underlying vault also has quality of life advantages, such as
                        cheaper gas for token transfers and less approvals.
                      </p>
                    </>
                  }
                  link="https://sushi.com/earn"
                  linkText="Visit Earn"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export const BuildWealthExplainer: FC<{
  id: string
  title: string
  content: ReactNode
  link: string
  linkText: string
  audience: string
}> = ({ id, audience, title, content, link, linkText }) => {
  const [open, setOpen] = useState(false)

  return (
    <AnimateSharedLayout>
      <motion.div layoutId={`container-${id}`}>
        <motion.div layoutId={`container-title-${id}`}>
          <Button
            onClick={() => setOpen(true)}
            className="!p-0 mt-3 whitespace-nowrap"
            size="md"
            variant="empty"
            endIcon={<ChevronRightIcon width={16} height={16} />}
          >
            {title}
          </Button>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, delay: 0.15 }}
              style={{ pointerEvents: 'auto' }}
              className="z-[2000] fixed bg-[rgba(0,0,0,0.6)] will-change-[opacity] inset-0 w-full"
              onClick={() => setOpen(false)}
            />
            <article
              onClick={() => setOpen(false)}
              className="w-full h-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed z-[2001] overflow-hidden px-[40px] py-0 flex items-center justify-center"
            >
              <motion.div
                layoutId={`container-${id}`}
                animate
                className="bg-neutral-800 p-[35px] rounded-xl flex flex-col gap-2 items-start"
              >
                <motion.div layoutId={`container-title-${id}`}>
                  <Typography variant="xs" weight={600} className="text-neutral-400 uppercase mb-1">
                    For {audience}
                  </Typography>
                  <Typography weight={600} variant="h2">
                    {title}
                  </Typography>
                </motion.div>
                <motion.div
                  className="max-w-[700px] w-[90vw] prose !prose-invert prose-neutral mt-5 pt-5 border-t border-neutral-200/5"
                  animate
                >
                  {content}
                </motion.div>
                <motion.div>
                  <Button
                    target="_blank"
                    as={Link.External}
                    href={link}
                    className="!p-0 mt-3 !no-underline"
                    variant="empty"
                    endIcon={<ExternalLinkIcon width={16} height={16} />}
                  >
                    {linkText}
                  </Button>
                </motion.div>
              </motion.div>
            </article>
          </>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  )
}
