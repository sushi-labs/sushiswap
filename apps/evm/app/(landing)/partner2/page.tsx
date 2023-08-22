import ArrowTopRightOnSquareIcon from '@heroicons/react/20/solid/ArrowTopRightOnSquareIcon'
import { Button, Container, Separator, SkeletonBox } from '@sushiswap/ui'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Partner Portal',
}

const STEPS = [
  {
    label: 'Step 1',
    title: 'Outreach',
    description:
      'Complete this form and provide as much information as you can to us. We take user safety seriously and would like to surface the most promising pools to our community.',
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
      'If your project successfully passes the due diligence process, Sushi will offer incentives to the LP farm associated with your project by providing $SUSHI tokens as dual incentives on top of single incentives provided by your project. The size of the $Sushi reward will be determined based on the trading volume of the pool.',
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
      <Container maxWidth="5xl" className="prose dark:prose-invert px-4 pb-20">
        <div className="flex flex-col justify-center pt-20">
          <h1 className="text-center">Partner with Sushi</h1>
          <div className="flex justify-center gap-4">
            <Button icon={ArrowTopRightOnSquareIcon} iconPosition="end" variant="secondary">
              ✨ Apply for Sushi Boost
            </Button>
            <Button icon={ArrowTopRightOnSquareIcon} iconPosition="end" variant="secondary">
              🗒 Whitelist your Token
            </Button>
            <Button icon={ArrowTopRightOnSquareIcon} iconPosition="end" variant="secondary">
              💭 General Enquiries
            </Button>
            <Button icon={ArrowTopRightOnSquareIcon} iconPosition="end" variant="secondary">
              💡 Partner Tutorials
            </Button>
          </div>
        </div>
        <div className="pt-12">
          <Separator />
        </div>
        <div className="flex gap-4 prose dark:prose-invert">
          <div>
            <h2>Request Sushi rewards to boost your liquidity pool ✨.</h2>
            <p>
              Anyone can set up a pool but farms require diligence from Sushi. Previously referred to as our Onsen
              program, our liquidity mining farms allows select <b>protocols with over $100k in liquidity</b> to receive
              Sushi rewards and boosted pools.
            </p>
            <p>
              The primary purpose of the liquidity mining program is to increase user participation and enhance the
              liquidity of your project on Sushi.
            </p>
            <div className="flex gap-6 pt-4 pb-10">
              <Button className="!px-10">Apply Now</Button>
              <Button variant="link">Don{`'`}t have a pool yet?</Button>
            </div>
          </div>
          <div>
            <SkeletonBox className="w-full h-full" />
          </div>
        </div>
        <div className="relative sm:pb-12 sm:ml-[calc(2rem+1px)] md:ml-[calc(3.5rem+1px)] lg:ml-[max(calc(14.5rem+1px),calc(100%-48rem))]">
          <div className="hidden absolute top-3 bottom-0 right-full mr-7 md:mr-[3.25rem] w-px bg-slate-200 dark:bg-slate-900 sm:block" />
          <div className="space-y-16">
            {STEPS.map((step) => (
              <article key={step.label} className="relative group">
                <div className="absolute -inset-y-2.5 -inset-x-4 md:-inset-y-4 md:-inset-x-6 sm:rounded-xl" />
                <svg
                  viewBox="0 0 9 9"
                  className="hidden absolute right-full mr-6 top-2 text-blue md:mr-12 w-[calc(0.5rem+1px)] h-[calc(0.5rem+1px)] overflow-visible sm:block"
                >
                  <circle cx="4.5" cy="4.5" r="4.5" stroke="currentColor" className="fill-blue-900" strokeWidth="2" />
                </svg>
                <div className="relative">
                  <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-200 pt-8 lg:pt-0">
                    {step.title}
                  </h3>
                  <div className="mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 dark:prose-invert line-clamp-2 text-slate-400">
                    <p>{step.description}</p>
                  </div>
                  <span className="absolute left-0 top-0 lg:left-auto lg:right-full lg:mr-[calc(6.5rem+1px)]">
                    <span className="whitespace-nowrap text-sm leading-6 dark:text-slate-400">{step.label}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="flex justify-center pt-10">
          <p className="text-sm text-center text-slate-500 max-w-xl">
            After the launch of the farm rewards, Sushi will continue to remain connected with your project and look to
            further collaborate on any opportunity that arises.
          </p>
        </div>
        <div className="py-12">
          <Separator />
        </div>
        <div className="prose dark:prose-invert">
          <h2>Get on the token list.</h2>
          <p>
            Though it isn’t required for users to swap and supply liquidity in the protocol, our default token list
            makes it easier for users to find tokens.
          </p>
          <p>
            Projects that wish to have their token show in the default swap list will need to submit their information
            via our partner portal. Otherwise users can search for any supported token via the contract address.
          </p>
          <Button className="!px-10 mt-4">Apply Now</Button>{' '}
        </div>
        <div className="py-12">
          <Separator />
        </div>
        <div className="prose dark:prose-invert">
          <h2>Sushi Collaboration Hub.</h2>
          <p>
            Attention all builders and developers! Sushi wants to reach out to anyone who is creating an innovative
            solution on top of our platform.
          </p>
          <p>Does one of the following apply to your project?</p>
          <ul>
            <li>Your project is in the process of launching a product that may utilize Sushi.</li>
            <li>Your project has already launched a product that leverages Sushi.</li>
            <li>
              Your project is currently leveraging Furo to stream salary or vest tokens and is seeking marketing
              support.
            </li>
            <li>Your project is currently supplying liquidity on Sushi and is seeking additional farm rewards.</li>
          </ul>
          <Button className="!px-10 mt-4 mb-6">Let{`'`}s Talk!</Button>
        </div>
      </Container>
    </>
  )
}
