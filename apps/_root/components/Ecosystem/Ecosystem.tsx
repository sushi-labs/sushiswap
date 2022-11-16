import { ChevronRightIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import { Button, classNames, Container, Link, Tab, Typography } from '@sushiswap/ui'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import React, { FC, useState } from 'react'

import { FuroSVG } from '../SVG/FuroSVG'

const TABS = [
  {
    title: 'Furo Streaming',
    content:
      'Automate your DAO salaries and vesting schedules while earning interest from yield strategies. Automate your DAO salaries and vesting schedules while earning.',
    image: FuroSVG,
    moreContent: (
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
    audience: 'Retail Users',
  },
  {
    title: 'Kashi Lending',
    content: 'test content',
    image: FuroSVG,
    moreContent: (
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
    audience: 'Retail Users',
  },
  {
    title: 'Launchpad',
    content: 'test content',
    image: FuroSVG,
    moreContent: '',
    link: 'https://sushi.com/miso',
    linkText: 'Visit Launchpad',
    audience: 'Retail Users',
  },
]

function transformTemplate(transformProps) {
  return `perspective(${transformProps.y.toString()}) rotateX(${transformProps.rotateX.toString()}) scale(${transformProps.scale.toString()})`
}

export const Ecosystem: FC = () => {
  const [_index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  return (
    <section className="py-20 sm:py-40 px-4 overflow-x-hidden">
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
            <Typography variant="hero" weight={600} className="text-center">
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
                <div className="p-10">
                  {TABS.map(({ title, content, image: Image, moreContent, link, linkText, audience }, index) => (
                    <Tab.Panel key={title} className="items-center grid grid-cols-1 md:grid-cols-2 gap-20">
                      <AnimateSharedLayout>
                        <div>
                          <Image />
                        </div>
                        <motion.div
                          layoutId={`ecosystem-container-${index}`}
                          className="flex flex-col gap-2 items-start"
                        >
                          <motion.div layoutId={`ecosystem-title-${index}`}>
                            <Typography weight={600} variant="h2">
                              {title}
                            </Typography>
                          </motion.div>
                          <div className="prose prose-dark !prose-invert prose-neutral">
                            <p>{content}</p>
                          </div>
                          <motion.div layoutId={`ecosystem-learn-${index}`}>
                            <Button
                              onClick={() => setOpen(true)}
                              className="!p-0 mt-3"
                              variant="empty"
                              endIcon={<ChevronRightIcon width={16} height={16} />}
                            >
                              Learn More
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
                                  layoutId={`ecosystem-container-${index}`}
                                  className="bg-neutral-800 p-[35px] rounded-xl flex flex-col gap-2 items-start"
                                >
                                  <motion.div layoutId={`ecosystem-title-${index}`}>
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
                                    {moreContent}
                                  </motion.div>
                                  <motion.div layoutId={`ecosystem-learn-${index}`}>
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
