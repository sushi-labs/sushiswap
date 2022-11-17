import { Container, Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { AnimatedTitle } from '../AnimatedTitle/AnimatedTitle'
import { ExpandableCard } from '../ExpandableCard/ExpandableCard'
import { MagnetSVG } from '../SVG/MagnetSVG'

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
            <div className="relative">
              <MagnetSVG />
              <div className="z-[1] absolute inset-0">
                <div className="blur-[100px] opacity-[0.25] w-full h-full rounded-full h-full w-full bg-[linear-gradient(160.45deg,_#F760E7_8.22%,_#197FDE_91.32%)]" />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <Typography variant="h3" weight={600} className="text-center md:text-left">
                Earn passive income with <br /> your coins.
              </Typography>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6">
                <ExpandableCard
                  caption="For Retail Users"
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
                <ExpandableCard
                  caption="For Retail Users"
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
                <ExpandableCard
                  caption="For Retail Users"
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
