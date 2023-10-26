import { Disclosure, Transition } from '@headlessui/react'
import { classNames, LinkExternal } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import sushiPulse from 'common/assets/sushi-pulse.png'
import sushidilly from 'common/assets/sushidilly.png'
import { DEFAULT_SIDE_PADDING } from 'common/helpers'
import { TriangleIcon } from 'common/icons'
import { roadmapSections } from 'common/roadmap'
import { format } from 'date-fns'
import { NextPage } from 'next'
import Image from 'next/legacy/image'

const About: NextPage = () => {
  return (
    <>
      <section
        className={classNames(
          'py-6 sm:py-[75px] bg-slate-800',
          DEFAULT_SIDE_PADDING,
        )}
      >
        <Container maxWidth="6xl" className="mx-auto grid gap-5 sm:gap-[60px]">
          <div className="grid gap-4">
            <p className="sm:text-base text-slate-400">About Us</p>
            <h1 className="text-2xl sm:text-5xl font-medium">
              Be a Crypto Chef with Sushi
            </h1>
            <p className="text-slate-50 sm:text-lg">
              Sushi is one of the most widely used decentralized cryptocurrency
              exchange, deployed on 10+ blockchains, and supporting thousands of
              tokens. You can trade, earn, stack yields, lend, borrow, leverage
              all on one decentralized, community driven platform. Welcome to
              the home of DeFi.
            </p>
          </div>
          <Image src={sushidilly} alt="sushidilly" unoptimized />
        </Container>
      </section>

      <section
        className={classNames('overflow-hidden relative', DEFAULT_SIDE_PADDING)}
      >
        <Container
          maxWidth="6xl"
          className="mx-auto py-9 sm:py-[75px] relative"
        >
          <article className="flex">
            <div className="md:w-[55%]">
              <h2 className="font-medium text-slate-50 text-xl sm:text-4xl">
                What is Sushi (SushiSwap)?
              </h2>
              <p className="text-slate-300 mt-4 sm:mt-[30px] sm:text-xl">
                Sushi is a decentralized exchange, we aim to be a one-stop shop
                for all your Decentralized Finance (DeFi) needs. Sushi allows
                users to trade cryptocurrencies without the need for a central
                operator administrator. We use a collection of liquidity pools
                to achieve this goal. Users first lock up assets into smart
                contracts, and traders then buy and sell cryptocurrencies from
                those pools, swapping out one token for another.
              </p>
              <p className="mt-[18px] sm:mt-10 w-fit from-[#0993EC] bg-clip-text text-transparent to-[#F338C3] bg-gradient-to-r text-xl sm:text-3xl">
                {'"私たちを期待してください"'}
              </p>
            </div>
            <div className="hidden absolute -right-[200px] -top-32 h-[800px] w-[800px] md:flex items-center justify-center">
              <Image
                src={sushiPulse}
                unoptimized
                objectFit="cover"
                alt="sushi-pulse"
              />
            </div>
          </article>
          <article className="mt-10 sm:mt-[100px]">
            <h2 className="font-medium text-slate-50 text-xl sm:text-4xl">
              Product Roadmap Sushi 2.0
            </h2>
            <p className="text-slate-300 mt-5 sm:mt-[30px] text-sm sm:text-xl">
              On 11th May 2022 the
              <LinkExternal
                href="https://snapshot.org/#/sushigov.eth/proposal/QmVfGe7ZqUS4HZhpxssPXPKJF8sCctcEsN1Sybo3p4F4zb"
                className="mx-2 underline"
              >
                Implementation Proposal
              </LinkExternal>
              for
              <LinkExternal
                href="https://mirror.xyz/0x4bb4c1B0745ef7B4642fEECcd0740deC417ca0a0/dFUiMYBl_xp2aN_F_Hc1abgP8NMv5Js5UYnup77MN0k"
                className="mx-2 underline !whitespace-normal"
              >
                {"Sushi 2.0 'A Restructure for the Road Ahead'"}
              </LinkExternal>
              was passed by the community with 92% of the votes (9.6 mln
              SushiPowah) in favor. The current team has collectively worked
              together on a long term roadmap & vision for what we would like to
              accomplish for Sushi. This roadmap has been outlined below.
            </p>
            <div className="mt-8 sm:mt-10 grid gap-6">
              {roadmapSections.map(({ product, description, lastUpdated }) => (
                <Disclosure
                  as="div"
                  className="bg-slate-800/50 rounded-lg"
                  key={product}
                >
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        as="div"
                        className="grid cursor-pointer px-4 pt-4 pb-6 sm:px-8 sm:pt-8 sm:pb-8 gap-2"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-semibold sm:font-bold text-lg sm:text-3xl text-slate-50">
                            {product}
                          </h4>
                          <div className="flex items-center justify-center rounded-full bg-slate-800 w-6 h-6 sm:w-[42px] sm:h-[42px]">
                            <TriangleIcon
                              className={classNames(
                                'transition sm:w-4 sm:h-4 h-3 w-3',
                                open && 'transform rotate-90',
                              )}
                            />
                          </div>
                        </div>
                        <span className="sm:text-base text-slate-400">
                          Last updated on{' '}
                          {format(new Date(lastUpdated), 'd MMM, y')}
                        </span>
                      </Disclosure.Button>
                      {open && (
                        <hr className="border border-slate-700 mx-4 sm:mx-8" />
                      )}
                      <Transition
                        className="transition-[max-height] overflow-hidden"
                        enter="duration-300 ease-in-out"
                        enterFrom="transform max-h-0"
                        enterTo="transform max-h-max"
                        leave="transition-[max-height] duration-250 ease-in-out"
                        leaveFrom="transform max-h-max"
                        leaveTo="transform max-h-0"
                      >
                        <Disclosure.Panel className="px-4 py-6 sm:px-8 sm:py-8">
                          {description}
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </article>
        </Container>
      </section>
    </>
  )
}

export default About
