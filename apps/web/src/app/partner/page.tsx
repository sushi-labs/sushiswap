import { Button } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import { LinkExternal, LinkInternal } from '@sushiswap/ui'
import { Separator } from '@sushiswap/ui'
import { typographyVariants } from '@sushiswap/ui'
import type { Metadata } from 'next'
import React from 'react'
import { CollabHubImage } from './collab-hub-image'
import { FarmerImage } from './farmer-image'

export const metadata: Metadata = {
  title: 'Partner Portal',
}

const STEPS = [
  {
    label: 'Step 1',
    title: 'Outreach',
    description: (
      <>
        Apply now and provide as much information as you can. We take user
        safety seriously and would like to surface the most promising pools to
        our community.
      </>
    ),
  },
  {
    label: 'Step 2',
    title: 'Dilligence',
    description:
      'If deemed necessary, we will make contact and perform a comprehensive evaluation to ensure project legitimacy and strategic alignment.',
  },
  {
    label: 'Step 3',
    title: 'Establish Farm',
    description:
      'If your project successfully passes the due diligence process, Sushi will offer incentives to the LP farm associated with your project by providing $SUSHI tokens as dual incentives on top of single incentives provided by your project. The size of the $SUSHI reward will be determined based on the trading volume of the pool.',
  },
  {
    label: 'Step 4',
    title: 'Launch Co-Marketing',
    description:
      'We will subsequently request branding materials to market the farm (Sushi’s Twitter, Blog etc.), and simultaneously launch the incentives for the farm.',
  },
]

export default async function PartnerPage() {
  return (
    <>
      <Container maxWidth="5xl" className="px-4 pb-20 animate-slide">
        <div className="flex flex-col justify-center pt-20">
          <div className="flex flex-col">
            <h1 className={typographyVariants({ variant: 'h1' })}>
              Partner <br /> with Sushi
            </h1>
            <p className={typographyVariants({ variant: 'lead' })}>
              Unlock new possibilities by partnering with us! We are excited to
              present a transformative opportunity for businesses and projects
              looking to elevate their presence in the decentralized finance
              landscape.
            </p>
          </div>
        </div>
        <div className="pt-12">
          <Separator />
        </div>
        <div className="flex gap-4 prose dark:prose-invert max-w-[unset]">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between md:gap-10 items-end">
              <div className="w-full">
                <h2>Boost your liquidity pool ✨</h2>
                <p>
                  Enhance your liquidity pool{'`'}s performance by tapping into
                  Sushi{`'`}s rewards system. By joining forces, you gain access
                  to an array of incentives that bolster liquidity provision,
                  thereby fostering deeper market engagement and participation.
                  As users provide liquidity to your pool, they receive
                  additional SUSHI rewards, creating a mutually beneficial
                  ecosystem where both your project and liquidity providers
                  thrive.
                </p>
              </div>
              <FarmerImage />
            </div>

            <div className="flex items-center gap-6 pt-4 pb-10">
              <LinkExternal href="https://rbieu62gj0f.typeform.com/to/c4dIghED">
                <Button className="!px-10" asChild>
                  Apply Now
                </Button>
              </LinkExternal>
              <LinkInternal href="/pool">
                <Button variant="link" asChild>
                  Don{`'`}t have a pool yet?
                </Button>
              </LinkInternal>
            </div>
          </div>
        </div>
        <div className="mt-10 relative sm:ml-[calc(2rem+1px)] md:ml-[calc(3.5rem+1px)] lg:ml-[max(calc(14.5rem+1px),calc(100%-48rem))]">
          <div className="hidden absolute top-3 bottom-0 right-full mr-7 md:mr-[3.25rem] w-px bg-slate-200 dark:bg-slate-900 sm:block" />
          <div className="space-y-16">
            {STEPS.map((step) => (
              <article key={step.label} className="relative group">
                <div className="absolute -inset-y-2.5 -inset-x-4 md:-inset-y-4 md:-inset-x-6 sm:rounded-xl" />
                <svg
                  viewBox="0 0 9 9"
                  className="hidden absolute right-full mr-6 top-2 text-blue md:mr-12 w-[calc(0.5rem+1px)] h-[calc(0.5rem+1px)] overflow-visible sm:block"
                >
                  <title>{step.title}</title>
                  <circle
                    cx="4.5"
                    cy="4.5"
                    r="4.5"
                    stroke="currentColor"
                    className="fill-blue"
                    strokeWidth="2"
                  />
                </svg>
                <div className="relative">
                  <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-200 pt-8 lg:pt-0">
                    {step.title}
                  </h3>
                  <div className="mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 dark:prose-invert">
                    <p>{step.description}</p>
                  </div>
                  <span className="absolute left-0 top-0 lg:left-auto lg:right-full lg:mr-[calc(6.5rem+1px)]">
                    <span className="whitespace-nowrap text-sm leading-6 dark:text-slate-400">
                      {step.label}
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="flex justify-center pt-10">
          <p className="text-sm text-center text-muted-foreground max-w-xl">
            After the launch of the farm rewards, Sushi will continue to remain
            connected with your project and look to further collaborate on any
            opportunity that arises.
          </p>
        </div>
        <div className="py-12">
          <Separator />
        </div>
        <div className="prose dark:prose-invert">
          <h2>Get on the token list.</h2>
          <p>
            Though it isn’t required for users to swap and supply liquidity in
            the protocol, our default token list makes it easier for users to
            find tokens.
          </p>
          <p>
            Projects that wish to have their token show in the default swap list
            will need to submit their information via our partner portal.
            Otherwise users can search for any supported token via the contract
            address.
          </p>
          <LinkInternal href="/tokenlist-request">
            <Button className="!px-10 mt-4" asChild>
              Apply Now
            </Button>{' '}
          </LinkInternal>
        </div>
        <div className="py-12">
          <Separator />
        </div>
        <div className="flex gap-4 prose dark:prose-invert max-w-[unset]">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between md:gap-10 items-end">
              <div className="w-full">
                <h2>Sushi collaboration hub.</h2>
                <p>
                  Experience the convenience of streamlined communication and
                  collaboration through our dedicated Sushi Collaboration Hub.
                  Whether you have inquiries, or wish to explore synergies with
                  other partners in the Sushi network, this hub serves as a
                  central platform to facilitate meaningful interactions. By
                  joining this vibrant community, you harness the collective
                  wisdom of decentralized finance pioneers, forging connections
                  that can lead to innovative breakthroughs.
                </p>
                <p>Does one of the following apply to your project?</p>
                <ul>
                  <li>
                    Your project is in the process of launching a product that
                    may utilize Sushi.
                  </li>
                  <li>
                    Your project has already launched a product that leverages
                    Sushi.
                  </li>
                  <li>
                    Your project is currently leveraging Furo to stream salary
                    or vest tokens and is seeking marketing support.
                  </li>
                  <li>
                    Your project is currently supplying liquidity on Sushi and
                    is seeking additional farm rewards.
                  </li>
                </ul>
              </div>
              <CollabHubImage />
            </div>

            <div className="flex items-center gap-6 pt-4 pb-10">
              <LinkExternal href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe">
                <Button className="!px-10 mt-4 mb-6" asChild>
                  Let{`'`}s Talk!
                </Button>
              </LinkExternal>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
