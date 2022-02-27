import React, { useEffect, useState } from 'react'
import sushiData from '@sushiswap/sushi-data'

import MobileMenu from '../components/MobileMenu'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import FeatureCard from '../components/FeatureCard'
import PartnerCard from '../components/PartnerCard'
import millify from 'millify'
import Image from 'next/image'

interface StateEntry {
  formatted: string
  number: number
  title: string
  decimalPlaces: number
}

const Landing = ({ stats }: { stats: StateEntry[] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = React.createRef<HTMLDivElement>()
  const handleClick = () =>
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[#0D0415]">
        <div
          className="relative pt-6"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/sushiswap/sushi-content/master/images/neon-street.jpg')`,
            backgroundPosition: 'center -5rem',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Menu setIsOpen={setIsOpen} isOpen={isOpen} />
          <MobileMenu setIsOpen={setIsOpen} isOpen={isOpen} />
          <div className="max-w-2xl px-5 pt-6 mx-auto sm:px-4">
            <div className="flex flex-col items-center space-y-4">
              <Image
                priority
                height={195}
                width={208}
                className="w-32 mx-auto sm:w-52"
                src="https://raw.githubusercontent.com/sushiswap/sushi-content/master/products/thicker-neon.png"
                alt="Neon Sushi Logo"
              />
              <div className="text-4xl font-semibold text-center text-white sm:text-5xl max-w-[698px]">
                Be a DeFi Chef with Sushi.
              </div>
              <div className="pt-4 text-lg text-center font-base text-[#E3E3E3]">
                Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform.
                Welcome home to DeFi.
              </div>
              <div className="w-full max-w-lg pt-6 mx-auto sm:w-auto sm:flex sm:justify-center sm:space-x-6">
                <div
                  className="rounded-md shadow-lg"
                  style={{ backgroundImage: 'linear-gradient(to right, #016eda, #d900c0)' }}
                >
                  <a
                    href="https://app.sushi.com/swap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white rounded-md shadow-strong"
                  >
                    Enter App
                  </a>
                </div>
                <div className="w-full mt-3 rounded-md shadow sm:w-auto sm:mt-0 sm:ml-3 bg-neutral-700">
                  <button
                    onClick={handleClick}
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white border border-transparent rounded-md"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-5xl px-4 pt-16 pb-8 mx-auto">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {stats &&
                stats.map((stat) => {
                  return (
                    <div
                      className="flex flex-col items-center px-6 py-8 text-center rounded-md bg-neutral-800 sm:px-14"
                      key={stat.title}
                    >
                      <div className="text-4xl font-semibold text-white">{stat.formatted}</div>
                      <div className="text-sm text-[#7F7F7F]">{stat.title}</div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
        <div className="max-w-3xl px-4 pt-10 pb-4 mx-auto sm:pt-28">
          <div className="text-2xl font-semibold text-center text-white sm:text-4xl max-w-[902px]" ref={ref}>
            Michelin star-worthy DeFi innovations crafted by our master chefs
          </div>
        </div>
        <div className="pt-10 mx-auto 2xl:max-w-screen-2xl">
          <div className="flex flex-row items-center justify-center px-10 pt-20 pb-8 mx-auto space-x-6 overflow-x-scroll no-scrollbar">
            <ProductCard
              imgUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/products/chopsticks.png"
              marginLeft={true}
              title="Multi-chain AMM"
              description={
                'The most competitive rates for DeFi bluechips anywhere. Switch to other chains in one click.'
              }
              cta="Enter Exchange"
              ctaLink="https://app.sushi.com"
              customSize="w-20 h-22"
            />
            <ProductCard
              imgUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/products/kashi-color-flat.png"
              title="Kashi Lending & Leverage"
              description={
                'Isolated lending markets, elastic interest rates. Leverage long short or create your own market.'
              }
              cta="Enter Kashi"
              ctaLink="https://app.sushi.com/lend"
            />
            <ProductCard
              imgUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/products/xsushi.png"
              title="xSUSHI staking"
              description="Earn governance rights and 0.05% of all swaps from all chains in one simple place."
              cta="Enter SushiBar"
              ctaLink="https://app.sushi.com/stake"
            />
            <ProductCard
              imgUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/products/onsen-icon.png"
              title="Onsen Program"
              description="Accelerate your project with onsen. Find the best yields anywhere in DeFi hands down."
              cta="Browse Yields"
              ctaLink="https://app.sushi.com/farm"
              paddingRight={true}
            />
          </div>
        </div>
        <div className="max-w-2xl px-4 pt-10 mx-auto sm:pt-28">
          <div className="text-2xl font-semibold text-center text-white sm:text-4xl max-w-[902px]">
            An evolving community for an evolving DeFi landscape
          </div>
        </div>
        <div className="pt-10 mx-auto 2xl:max-w-screen-2xl">
          <div className="flex flex-row items-center justify-center px-10 py-8 mx-auto space-x-6 overflow-x-scroll no-scrollbar">
            <FeatureCard
              imgUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/icons/wallet.png"
              marginLeft={true}
              title="20+"
              description="Wallets Supported"
            />
            <FeatureCard
              imgUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/icons/intersection.png"
              title="14"
              description="Chains Supported"
            />
            <FeatureCard
              imgUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/icons/group.png"
              title="25k+"
              description="Discord Members"
            />
            <FeatureCard
              imgUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/icons/sushi-outline.png"
              title="150k+"
              description="Sushi Holders"
              paddingRight={true}
            />
          </div>
        </div>
        <div className="max-w-2xl px-4 pt-10 mx-auto sm:pt-28">
          <div className="text-2xl font-semibold text-center text-white sm:text-4xl max-w-[902px]">
            Meet the partners helping us cook up the tastiest dishes in DeFi.
          </div>
        </div>
        <div className="max-w-6xl pt-10 pb-32 mx-auto">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-6">
            <PartnerCard
              logoUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/partners/yearn-neon.png"
              name="Yearn Finance"
              url="https://yearn.finance/"
            />
            <PartnerCard
              logoUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/partners/cream-neon.png"
              name="CREAM Finance"
              url="https://cream.finance/"
            />
            <PartnerCard
              logoUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/partners/aave-neon.png"
              name="Aave"
              url="https://aave.com/"
            />
            <PartnerCard
              logoUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/partners/pickle-neon.png"
              name="Pickle Finance"
              url="https://pickle.finance/"
            />
            <PartnerCard
              logoUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/partners/akro-neon.png"
              name="Akropolis"
              url="https://akropolis.io/"
            />
            <PartnerCard
              logoUrl="https://raw.githubusercontent.com/sushiswap/sushi-content/master/partners/keep3r-neon.png"
              name="Keep3r Network"
              url="https://keep3r.network/"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

// This function runs only on the server side
export async function getStaticProps() {
  const results = await Promise.all([sushiData.sushi.priceUSD(), sushiData.exchange.factory()])
  return {
    props: {
      stats: [
        {
          formatted: `$${millify(results[0])}`,
          number: Number(results[0]),
          title: '$SUSHI Price',
          decimalPlaces: 2,
        },
        {
          formatted: `$${millify(results[1].liquidityUSD)}`,
          number: Number(results[1].liquidityUSD),
          title: 'Total Liquidity',
          decimalPlaces: 0,
        },
        {
          formatted: `$${millify(results[1].volumeUSD)}`,
          number: Number(results[1].volumeUSD),
          title: 'Total Volume',
          decimalPlaces: 0,
        },
        {
          formatted: `${millify(results[1].pairCount)}`,
          number: Number(results[1].pairCount),
          title: 'Total Pairs',
          decimalPlaces: 0,
        },
      ],
    },
  }
}

export default Landing
