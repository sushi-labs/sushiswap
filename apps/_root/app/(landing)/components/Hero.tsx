import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { ChainId } from '@sushiswap/chain'
import { Native, SUSHI } from '@sushiswap/currency'
import { useInterval } from '@sushiswap/hooks'
import { Button, classNames, Container, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui'
import { CurrencyInput } from '@sushiswap/wagmi/components/Web3Input/Currency'
import { motion } from 'framer-motion'
import React, { FC, useEffect, useState } from 'react'

import { Search } from './Search'

const TITLES = ['Whenever', 'Wherever', 'Whoever']
const VALUES = [
  { value0: '1', value1: '867.5' },
  { value0: '1.', value1: '867.5' },
  { value0: '1.4', value1: '1214.448' },
  { value0: '1.43', value1: '1240.464' },
  { value0: '1.435', value1: '1244.80654' },
]

export const Hero: FC = () => {
  const [index, setIndex] = useState(0)
  const [valueIndex, setValueIndex] = useState<number>(-1)

  useInterval(() => setIndex((prev) => (prev + 1) % 3), 1500)

  useEffect(() => {
    const setIndex = (i: number) => {
      if (i < 5) {
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
            <Typography variant="hero" weight={800} className="text-neutral-50 leading-[3.5rem]">
              Buy and Sell Instantly on Sushi. <br /> <span className="text-blue"> {TITLES[index]}.</span>
            </Typography>
            <Typography variant="lg" className="mt-3 text-neutral-400">
              No registration needed. Over 400 tokens to trade at your fingertips.
            </Typography>
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
              <Widget id="test" maxWidth={400} className="relative">
                <motion.div
                  initial={{ opacity: 0.08 }}
                  animate={{ opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.7,
                  }}
                  className="bg-white absolute inset-0 z-[10]"
                />
                <Widget.Content>
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.6,
                    }}
                  >
                    <div className={classNames('p-3 mx-0.5 grid grid-cols-2 items-center pb-4 font-medium')}>
                      <div className="flex items-center gap-4 text-sm font-semibold text-slate-200">
                        <div>Swap</div>
                        <div>xSwap</div>
                      </div>
                    </div>
                  </motion.div>
                  <CurrencyInput
                    className="p-3"
                    value={valueIndex >= 0 ? VALUES[valueIndex].value0 : ''}
                    onChange={() => {}}
                    onSelect={() => {}}
                    currency={Native.onChain(ChainId.ETHEREUM)}
                    chainId={ChainId.ETHEREUM}
                    tokenMap={{}}
                    disabled={true}
                  />
                  <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                    <button
                      type="button"
                      className=" group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
                    >
                      <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
                        <ChevronDownIcon width={16} height={16} />
                      </div>
                    </button>
                  </div>
                  <div className="bg-slate-800">
                    <CurrencyInput
                      className="p-3 "
                      value={valueIndex >= 0 ? VALUES[valueIndex].value1 : ''}
                      onChange={() => {}}
                      onSelect={() => {}}
                      currency={SUSHI[ChainId.ETHEREUM]}
                      chainId={ChainId.ETHEREUM}
                      tokenMap={{}}
                      disabled={true}
                    />
                    <div className="p-3 pt-0">
                      <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.8,
                          delay: 3,
                        }}
                      >
                        <Button as="a" href="https://www.sushi.com/swap" size="md" fullWidth className="relative z-10">
                          Trade Now
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </Widget.Content>
              </Widget>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
