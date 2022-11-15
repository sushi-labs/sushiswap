import { ChevronRightIcon } from '@heroicons/react/solid'
import { Button, classNames, Container, Typography } from '@sushiswap/ui'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { FC, useState } from 'react'

import { CustodyImage } from './CustodyImage'

export const Custody: FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <section className="py-60">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_380px] gap-[100px]">
          <CustodyImage />
          <div className="flex flex-col justify-center gap-3">
            <AnimateSharedLayout>
              <motion.div layoutId={`custody-container`} className="flex flex-col items-center lg:items-start">
                <motion.div layoutId={`custody-title`} className="flex flex-col items-center lg:items-start z-[2001]">
                  <Typography variant="h1" weight={600} className="text-center lg:text-left">
                    Your keys, your coins
                  </Typography>
                  <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2">
                    As decentralized as it goes.
                  </Typography>
                </motion.div>

                <Button
                  onClick={() => setOpen(true)}
                  className="!p-0 mt-3"
                  variant="empty"
                  endIcon={<ChevronRightIcon width={16} height={16} />}
                >
                  Learn More
                </Button>
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
                      className="z-[2001] fixed bg-[rgba(0,0,0,0.6)] will-change-[opacity] inset-0 w-full"
                      onClick={() => setOpen(false)}
                    />
                    <article className="w-full h-full pointer-events-none top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed z-[2001] overflow-hidden px-[40px] py-0 flex items-center justify-center">
                      <motion.div
                        layoutId={`custody-container`}
                        className={classNames(
                          'bg-neutral-900 p-[35px] rounded-xl h-[auto] max-w-[700px] overflow-hidden pointer-events-none relative w-full h-full m-[0_auto]'
                        )}
                      >
                        <div className="flex flex-col items-center lg:items-start">
                          <motion.div layoutId={`custody-title`} className="flex flex-col items-center lg:items-start">
                            <Typography variant="h1" weight={600} className="text-center lg:text-left">
                              Your keys, your coins
                            </Typography>
                            <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2">
                              As decentralized as it goes.
                            </Typography>
                          </motion.div>
                        </div>
                        <motion.div animate className="prose !prose-invert prose-neutral prose-dark mt-10">
                          <h3>What is OpenMEV?</h3>
                          <p>
                            OpenMEV aims to provide a credible neutral platform for facilitating both aggregation and
                            direct communication channels between block validators, block producers and block
                            synchronizers for the Ethereum and EVM-based networks.
                          </p>
                          <p>Example use cases include:</p>
                          <ul>
                            <li>
                              Users that would like to communicate their preferred transaction order within a block.
                            </li>
                            <li>Account abstraction via private mempool </li>
                          </ul>
                          <p>
                            OpenMEV is built on top of SecureRPC. SecureRPC provides users with an accessible,
                            convenient and secure infrastructure for transaction routing and execution.
                          </p>
                          <ul>
                            <li>
                              Accessible: allow ordinary users to easily discover the trading risk and value on the
                              network.
                            </li>
                            <li>
                              Convenient: enable backrunning swaps automatically so that more opportunities to capture
                              profits at a lower cost.
                            </li>
                            <li>Secure: make transactions on the blockchain network more secure and private.</li>
                          </ul>
                        </motion.div>
                      </motion.div>
                    </article>
                  </>
                )}
              </AnimatePresence>
            </AnimateSharedLayout>
          </div>
        </div>
      </Container>
    </section>
  )
}
