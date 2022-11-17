import { ChevronRightIcon } from '@heroicons/react/solid'
import { Button, classNames, Container, Tab, Typography } from '@sushiswap/ui'
import { motion } from 'framer-motion'
import React, { FC, useState } from 'react'

import { ExpandableCard, ExpendableCardData } from '../ExpandableCard/ExpandableCard'
import { FuroSVG } from '../SVG/FuroSVG'
import { KashiSVG } from '../SVG/KashiSVG'
import { MisoSVG } from '../SVG/MisoSVG'

interface TabsExpendableCardData extends ExpendableCardData {
  summary: string
  image: (props: React.ComponentProps<'svg'>) => JSX.Element
}

const TABS: TabsExpendableCardData[] = [
  {
    title: 'Furo Streaming',
    summary: 'Automate your DAO salaries and vesting schedules while earning interest from yield strategies.',
    image: FuroSVG,
    content: (
      <>
        <p>
          Furo is Sushi’s payment streaming and token vesting application, a useful and efficient way of setting up
          automatic payments for contributors to your protocol or DAO, or for executing a company payroll.
        </p>
        <h3>Fully customizable</h3>
        <p>
          With Furo’s easy to use interface, set any number of parameters you’d like: the asset to be paid in, the
          frequency with which to pay them that asset, when to start paying it, when to stop paying it, etc. Or, set up
          traditional token vestings with optional cliffs, complete with an array of options for paying out as well.
        </p>
        <h3>Completely under your control</h3>
        <p>
          Additionally, choose to keep your funds in the Sushi Vault to accrue more yield, making your direct deposits
          even larger without you having to do a thing.
        </p>
      </>
    ),
    link: 'https://sushi.com/furo',
    linkText: 'Pay Someone',
    caption: 'For Retail Users',
  },
  {
    title: 'Kashi Lending',
    summary: 'Define your own risk profile. Borrow and Lend with confidence',
    image: KashiSVG,
    content: (
      <>
        <span>
          Kashi allows for lending across a multitude of assets with varying risk tolerances, including tokens,
          stablecoins and synthetics.
        </span>
        <h3>Isolated risk</h3>
        <p>
          Any user can create a customized, gas-efficient market thanks to Kashi’s unique isolated markets, allowing
          them to define their own risk profile.{' '}
        </p>
        <p>
          Unlike in traditional money markets which use a pooled asset model, Kashi utilizes an isolated market model
          that isolates the risk to just that market, making lending exponentially safer for users who wish to do so.
        </p>
        <h3>Interest rate model</h3>
        <p>A variable interest rate ensures that lenders make the most yield possible, efficiently.</p>
      </>
    ),
    link: 'https://sushi.com/kashi',
    linkText: 'Visit Kashi',
    caption: 'For Retail Users',
  },
  {
    title: 'Miso Launchpad',
    summary: 'Be an early participant in the latest Web3 projects.',
    image: MisoSVG,
    content: 'Join new projects launched using our launchpad Miso.',
    link: 'https://sushi.com/miso',
    linkText: 'Visit Launchpad',
    caption: 'For Retail Users',
  },
]

function transformTemplate(transformProps) {
  return `perspective(${transformProps.y.toString()}) rotateX(${transformProps.rotateX.toString()}) scale(${transformProps.scale.toString()})`
}

export const Ecosystem: FC = () => {
  const [_index, setIndex] = useState(0)

  return (
    <section className="py-20 sm:py-40 px-1 overflow-x-hidden">
      <Container maxWidth="5xl" className="mx-auto">
        <div className="border-2 border-neutral-800 rounded-xl">
          <div className="h-[28px] flex items-center px-[10px] border-b-2 border-neutral-800 flex gap-2">
            <div className="rounded-full w-[10px] h-[10px] bg-red" />
            <div className="rounded-full w-[10px] h-[10px] bg-yellow" />
            <div className="rounded-full w-[10px] h-[10px] bg-green" />
          </div>
          <div className="flex flex-col gap-3 py-10">
            <Typography weight={400} className="text-center text-slate-400">
              Ecosystem
            </Typography>
            <Typography variant="hero" weight={600} className="!text-4xl !md:text-5xl px-4 text-center">
              Explore our suite of <span className="text-blue">DeFi</span> Products
            </Typography>
            <Tab.Group selectedIndex={_index} onChange={setIndex}>
              <div className="relative flex justify-center mt-10">
                <div className="absolute inset-0 top-[50%] z-[0] h-px bg-neutral-800" />
                {TABS.map((el, index) => (
                  <Button
                    as={Tab}
                    key={el.title}
                    size="sm"
                    className={classNames(
                      index === 0 ? 'rounded-r-none rounded-l-2xl' : '',
                      index === TABS.length - 1 ? 'rounded-l-none rounded-r-2xl' : '',
                      '!ring-0 rounded-none z-[1] text-white',
                      _index === index ? 'bg-blue-600' : 'bg-neutral-600'
                    )}
                  >
                    {el.title}
                  </Button>
                ))}
              </div>
              <Tab.Panels>
                <div className="flex items-center p-10 min-h-[520px]">
                  {TABS.map(({ title, content, image: HeroImage, summary, link, linkText, caption }) => (
                    <Tab.Panel key={title} className="items-center grid grid-cols-1 md:grid-cols-2 gap-20">
                      <div className="w-[420px] relative">
                        <HeroImage width={420} />
                      </div>
                      <ExpandableCard title={title} caption={caption} content={content} link={link} linkText={linkText}>
                        {({ setOpen, containerId, titleId }) => (
                          <motion.div layoutId={containerId} className="flex flex-col items-center lg:items-start">
                            <Typography
                              as={motion.h1}
                              layoutId={titleId}
                              variant="h1"
                              weight={600}
                              className="flex flex-col items-center lg:items-start text-center lg:text-left"
                            >
                              {title}
                            </Typography>
                            <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2">
                              {summary}
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
                    </Tab.Panel>
                  ))}
                </div>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </Container>
    </section>
  )
}
