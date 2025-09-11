import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { useInterval } from '@sushiswap/hooks'
import { LinkInternal, typographyVariants } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui'
import { motion } from 'framer-motion'
import React, { type FC, useEffect, useState } from 'react'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/Currency'
import { ChainId } from 'sushi'
import { EvmNative, SUSHI } from 'sushi/evm'

const TITLES = ['Whenever', 'Wherever', 'Whoever']
const VALUES = [
  { value0: '1', value1: '2812.18' },
  { value0: '1.', value1: '2812.18' },
  { value0: '1.4', value1: '3936.03' },
  { value0: '1.43', value1: '4020.3' },
  { value0: '1.435', value1: '4034.34' },
]

export const Hero: FC = () => {
  const [index, setIndex] = useState(0)
  const [valueIndex, setValueIndex] = useState<number>(-1)

  useInterval(() => setIndex((prev) => (prev + 1) % 3), 1500)

  useEffect(() => {
    const setIndex = (i: number) => {
      if (i < VALUES.length) {
        setValueIndex(i)
        setTimeout(() => setIndex(i + 1), 100)
      }
    }

    setTimeout(() => setIndex(0), 2400)
  }, [])

  return (
    <section className="relative">
      <Container maxWidth="5xl" className="px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_400px] flex justify-between gap-[100px]">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <h1 className={typographyVariants({ variant: 'h1' })}>
                Buy and Sell Instantly on Sushi.{' '}
                <span className="text-blue"> {TITLES[index]}.</span>
              </h1>
              <p
                className={typographyVariants({
                  variant: 'lead',
                  className: 'max-w-[500px]',
                })}
              >
                Unlock the world of cryptocurrency trading. Experience the
                freedom to trade over 400 tokens instantly, no registration
                needed.
              </p>
            </div>
          </div>
          <div className="relative justify-end hidden lg:flex">
            <motion.div
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.7,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1.6,
                }}
              >
                <div className="flex gap-2 mb-4">
                  <Button size="sm" variant="secondary">
                    Swap
                  </Button>
                  <Button
                    className="pointer-events-none opacity-40"
                    size="sm"
                    variant="secondary"
                  >
                    Limit
                  </Button>
                </div>
              </motion.div>
              <CurrencyInput
                type="INPUT"
                className="p-4 bg-white dark:bg-slate-900 rounded-xl"
                value={valueIndex >= 0 ? VALUES[valueIndex].value0 : ''}
                currency={EvmNative.fromChainId(ChainId.ETHEREUM)}
                chainId={ChainId.ETHEREUM}
                disabled={true}
              />
              <div className="left-0 right-0 mt-[-9px] mb-[-9px] flex items-center justify-center">
                <button
                  type="button"
                  className="z-10 p-2 transition-all bg-gray-100 border-white rounded-full cursor-pointer group hover:bg-gray-200 hover:dark:bg-slate-700 dark:bg-slate-900"
                >
                  <div className="transition-transform rotate-0 group-hover:rotate-180">
                    <ArrowDownIcon
                      strokeWidth={3}
                      className="w-4 h-4 text-blue"
                    />
                  </div>
                </button>
              </div>
              <CurrencyInput
                type="OUTPUT"
                className="p-4 bg-white dark:bg-slate-900 rounded-xl"
                value={valueIndex >= 0 ? VALUES[valueIndex].value1 : ''}
                currency={SUSHI[ChainId.ETHEREUM]}
                chainId={ChainId.ETHEREUM}
                disabled={true}
              />
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 3,
                }}
                className="mt-4"
              >
                <Button size="xl" asChild fullWidth>
                  <LinkInternal href="https://www.sushi.com/swap">
                    Trade Now
                  </LinkInternal>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
