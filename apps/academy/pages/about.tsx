import { Disclosure, Transition } from '@headlessui/react'
import { Chip, classNames, Container } from '@sushiswap/ui'
import sushiPulse from 'common/assets/sushi-pulse.png'
import sushidilly from 'common/assets/sushidilly.png'
import { defaultSidePadding } from 'common/helpers'
import { TriangleIcon } from 'common/icons'
import { NextPage } from 'next'
import Image from 'next/image'

const productStats = [
  { value: '20', name: 'Projects Launched' },
  { value: '$500m', name: 'Funds Raised' },
  { value: '13k', name: 'Users Participated' },
  { value: '$4m', name: 'Volume Generated' },
  { value: '$4m', name: 'Volume' },
]

const About: NextPage = () => {
  return (
    <>
      <section className={classNames('py-6 sm:py-[75px] bg-slate-800', defaultSidePadding)}>
        <Container maxWidth="6xl" className="mx-auto grid gap-5 sm:gap-[60px]">
          <div className="grid gap-4">
            <p className="sm:text-base text-slate-400">About Us</p>
            <h1 className="text-2xl sm:text-[52px] font-medium">Be a Crypto Chef with Sushi</h1>
            <p className="text-slate-50 sm:text-lg">
              Sushi is one of the most widely used decentralized cryptocurrency exchange, deployed on 10+ blockchains,
              and supporting thousands of tokens. You can trade, earn, stack yields, lend, borrow, leverage all on one
              decentralized, community driven platform. Welcome to the home of DeFi.
            </p>
          </div>
          <Image src={sushidilly} alt="sushidilly" unoptimized />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,155px))] justify-between gap-y-6">
            {productStats.map(({ name, value }) => (
              <div key={name} className="grid grid-rows-[repeat(2, minmax(0,1fr))] gap-1.5">
                <p className="text-xl sm:text-3xl font-bold text-slate-50">{value}</p>
                <p className="sm:text-base text-slate-300">{name}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className={classNames('overflow-hidden relative', defaultSidePadding)}>
        <Container maxWidth="6xl" className="mx-auto py-9 sm:py-[75px] relative">
          <article className="flex">
            <div className="md:w-[55%]">
              <h2 className="font-medium text-slate-50 text-xl sm:text-4xl">What is Sushi (SushiSwap)?</h2>
              <p className="text-slate-300 mt-4 sm:mt-[30px] sm:text-xl">
                Sushi is a decentralized exchange, we aim to be a one-stop shop for all your Decentralized Finance
                (DeFi) needs. Sushi allows users to trade cryptocurrencies without the need for a central operator
                administrator. We use a collection of liquidity pools to achieve this goal. Users first lock up assets
                into smart contracts, and traders then buy and sell cryptocurrencies from those pools, swapping out one
                token for another.
              </p>
              <p className="mt-[18px] sm:mt-10 w-fit sm:bg-none sm:text-[#F338C3] from-[#0993EC] bg-clip-text text-transparent to-[#F338C3] bg-gradient-to-r text-xl sm:text-3xl">
                {'"私たちを期待してください"'}
              </p>
            </div>
            <div className="hidden absolute -right-[200px] -top-32 h-[800px] w-[800px] md:flex items-center justify-center">
              <Image src={sushiPulse} unoptimized objectFit="cover" alt="sushi-pulse" />
            </div>
          </article>
          <article className="mt-[100px]">
            <h2 className="font-medium text-slate-50 text-xl sm:text-4xl">Product Roadmap Sushi 2.0</h2>
            <p className="text-slate-300 mt-5 sm:mt-[30px] text-sm sm:text-xl">
              Neque veniam esse harum ea tenetur non sit. Reiciendis exercitation incidunt quasi. Facere earum sit
              repellat parquia diema repellendus sed est aut. Est ipsa inventore iure fugit voluptate.
            </p>
            <div className="mt-8 sm:mt-10 grid gap-6">
              <Disclosure as="div" className="bg-slate-800/50 rounded-lg">
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      as="div"
                      className="grid cursor-pointer px-4 pt-4 pb-6 sm:px-8 sm:pt-8 sm:pb-8 gap-2"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-semibold sm:font-bold text-lg sm:text-3xl text-slate-50">Miso Launchpad</h4>
                        <div className="flex items-center justify-center rounded-full bg-slate-800 w-6 h-6 sm:w-[42px] sm:h-[42px]">
                          <TriangleIcon
                            className={classNames('transition sm:w-4 sm:h-4 h-3 w-3', open && 'transform rotate-90')}
                          />
                        </div>
                      </div>
                      <div className="flex sm:gap-[14px] flex-wrap">
                        <span className="sm:text-base text-slate-400">Last update on 23 sep, 2022:</span>
                        <div className="flex gap-1 sm:gap-[14px] flex-wrap">
                          {['Dashboard Designs', 'Crosschain Support', 'New UI'].map((label, i, a) => (
                            <>
                              <span className="sm:hidden">
                                {label}
                                {i !== a.length - 1 && ','}
                              </span>
                              <Chip label={label} key={label} className="sm:inline-flex hidden" />
                            </>
                          ))}
                        </div>
                      </div>
                    </Disclosure.Button>
                    {open && <hr className="border border-slate-700 mx-4 sm:mx-8" />}
                    <Transition
                      className="transition-[max-height] overflow-hidden"
                      enter="duration-300 ease-in-out"
                      enterFrom="transform max-h-0"
                      enterTo="transform max-h-max"
                      leave="transition-[max-height] duration-250 ease-in-out"
                      leaveFrom="transform max-h-max"
                      leaveTo="transform max-h-0"
                    >
                      <Disclosure.Panel className="text-gray-500 px-4 py-6 sm:px-8 sm:py-8">
                        Our solution to launching a new token or introducing price discovery for many kinds of `assets
                        on release. Lots of work over the last few months has gone into integrating Miso directly into
                        our main Sushi app, and we now have a better system in place to scale up the completely
                        permissionless framework. Continued work will be done in regards to introducing new forms of
                        recipes, or scripts per se that have unified steps that are taken during an auction and on
                        release of a new token. The auction creation process can then cater to any project’s pre and
                        post-launch plans. Some of these enhancements include: Gnosis Safe or Minimal Multisig
                        Deployment on launch. Liquidity Lockups or direct Liquidity Launching to spin up liquidity pairs
                        the moment an auction ends. Vesting schedule put into place at the end of an auction. Direct
                        incentive deployment, to establish well incentivized farms for new projects looking to build
                        their liquidity on Sushi from day one. In the past Miso was gatekept, or required team
                        involvement to help projects launch tokens and provide assistance during the process. Today,
                        Miso is now completely permissionless and anyone has the ability to spin up new auctions at any
                        time. Permissionless Miso has been deployed onto a number of major networks, and is available to
                        use for any project regardless of the chain they decide to launch on. Decentralized curation or
                        signaling of Miso Auctions is being explored, and we will continue to seek ways we can further
                        improve the experience for users to ensure that they are participating in legitimate auctions.
                        Read Less
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </div>
          </article>
        </Container>
      </section>
    </>
  )
}

export default About
