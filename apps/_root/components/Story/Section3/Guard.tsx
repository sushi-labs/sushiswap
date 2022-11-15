import { ChevronRightIcon } from '@heroicons/react/solid'
import { Button, classNames, Container, Typography } from '@sushiswap/ui'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { FC, useState } from 'react'

import { GuardImage } from './GuardImage'

export const Guard: FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <section className="py-20 sm:py-40">
      <Container maxWidth="5xl" className="mx-auto px-4 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_380px] gap-[100px]">
          <GuardImage />
          <div className="flex flex-col justify-center gap-3">
            <AnimateSharedLayout>
              <div className="flex flex-col items-center lg:items-start">
                <motion.div layoutId={`custody-title`} className="flex flex-col items-center lg:items-start z-[2001]">
                  <Typography variant="h1" weight={600} className="text-center lg:text-left">
                    Keep more profits and earn gas refunds.
                  </Typography>
                  <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2">
                    Enable SushiGuard and say no to MEV attacks.
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
              </div>
              <AnimatePresence>
                {open && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.2, delay: 0.15 }}
                      style={{ pointerEvents: 'auto' }}
                      className="z-[2000] fixed bg-[rgba(0,0,0,0.6)] will-change-[opacity] inset-0 w-full backdrop-blur"
                      onClick={() => setOpen(false)}
                    />
                    <article className="w-full h-full pointer-events-none top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed z-[2001] overflow-hidden px-[40px] py-0 flex items-center justify-center">
                      <motion.div
                        className={classNames(
                          'h-[auto] max-w-[700px] overflow-hidden pointer-events-none relative w-full h-full m-[0_auto]'
                        )}
                      >
                        <div className="flex flex-col items-center lg:items-start">
                          <motion.div layoutId={`custody-title`} className="flex flex-col items-center lg:items-start">
                            <Typography variant="h1" weight={600} className="text-center lg:text-left">
                              Keep more profits and earn gas refund.
                            </Typography>
                            <Typography variant="lg" weight={400} className="text-center lg:text-left mt-2">
                              Enable SushiGuard and say no to MEV attacks.
                            </Typography>
                          </motion.div>
                        </div>
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
