import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { Native, SUSHI } from '@sushiswap/currency'
import { useInterval } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/components/button'
import { Container } from '@sushiswap/ui/components/container'
import { CurrencyInput } from '@sushiswap/wagmi/future/components/Web3Input/Currency'
import { motion } from 'framer-motion'
import React, { FC, useEffect, useState } from 'react'

import { Search } from './Search'

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
            <p className="text-5xl font-semibold text-neutral-50 leading-[3.5rem] tracking-tight">
              Buy and Sell Instantly on Sushi. <span className="text-blue"> {TITLES[index]}.</span>
            </p>
            <p className="mt-3 text-lg text-neutral-400">
              No registration needed. Over 400 tokens to trade at your fingertips.
            </p>
            <div className="mt-10">
              <Search />
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
                  <Button className="pointer-events-none opacity-40" size="sm" variant="secondary">
                    Limit
                  </Button>
                </div>
              </motion.div>
              <CurrencyInput
                type="INPUT"
                className="p-3 bg-white dark:bg-slate-800 rounded-xl"
                value={valueIndex >= 0 ? VALUES[valueIndex].value0 : ''}
                onChange={() => {}}
                onSelect={() => {}}
                currency={Native.onChain(ChainId.ETHEREUM)}
                chainId={ChainId.ETHEREUM}
                disabled={true}
              />
              <div className="left-0 right-0 mt-[-9px] mb-[-9px] flex items-center justify-center">
                <button
                  type="button"
                  className="z-10 p-2 transition-all bg-gray-100 border-white rounded-full cursor-pointer group hover:bg-gray-200 hover:dark:bg-slate-700 dark:bg-slate-900"
                >
                  <div className="transition-transform rotate-0 group-hover:rotate-180">
                    <ArrowDownIcon strokeWidth={3} className="w-4 h-4 text-blue" />
                  </div>
                </button>
              </div>
              <CurrencyInput
                type="OUTPUT"
                className="p-3 bg-white dark:bg-slate-800 rounded-xl"
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
                  <a href="https://www.sushi.com/swap">Trade Now</a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
