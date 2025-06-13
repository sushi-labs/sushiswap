'use client'

import {
  ArrowRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import type { FC } from 'react'
import { NetTradingGainChart } from './NetTradingGainChart'

interface NoImpermanentLossTabProps {
  pool: BladePool
}

export const NoImpermanentLossTab: FC<NoImpermanentLossTabProps> = () => {
  return (
    <div className="z-10 flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:px-8 lg:flex-row lg:gap-0 lg:px-12">
      <div className="flex w-full flex-col items-center lg:w-[468px] lg:items-start">
        <div className="flex max-w-lg flex-col items-center gap-8 pb-8 text-center lg:max-w-full lg:items-start lg:gap-12 lg:pb-12 lg:text-start">
          <div className="flex flex-col items-center gap-6 lg:items-start">
            <h2 className="!leading-[1.4] w-full font-bold text-2xl text-black sm:text-3xl lg:w-[467px] lg:text-4xl dark:text-white">
              No Impermanent Loss + Net Trading Gain &gt; HODL
            </h2>
            <p className="w-full text-base text-gray-500 leading-[1.4] lg:text-lg dark:text-gray-400">
              Blade rebalances your liquidity faster than bots, so you never
              experience Impermanent Loss. It's not magic, it's offchain
              computation combined with onchain proof.
              <br />
              <br />
              Finally, real gains that can outperform HODLing.
            </p>
          </div>
          <Button
            variant="secondary"
            className="flex items-center gap-2.5 rounded-full bg-[#3D657C0A] px-4 py-2 shadow-sm dark:bg-gray-800"
          >
            <span className="font-medium text-gray-700 text-sm tracking-tight sm:text-base dark:bg-gradient-to-r dark:from-[#B5E8FC] dark:to-[#D7A8E9] dark:bg-clip-text dark:text-transparent">
              What Is No Impermanent Loss Benchmark?
            </span>
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#22485D] dark:bg-gradient-to-r dark:from-[#B5E8FC] dark:to-[#D7A8E9]">
              <ArrowRightIcon className="h-3 w-3 text-gray-100 dark:text-gray-900" />
            </div>
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col items-center overflow-hidden rounded-[20px] bg-white p-4 sm:p-6 lg:w-auto lg:overflow-visible lg:p-10 dark:bg-gray-900">
        {/* Net Trading Gain Header */}
        <div className="mb-4 flex w-full flex-col items-start gap-4 lg:gap-6">
          <div className="flex flex-col items-start gap-2">
            <div className="flex w-full flex-row items-center gap-1">
              <div className="font-semibold text-gray-500 text-sm tracking-tight dark:text-gray-400">
                Net Trading Gain
              </div>
              <InformationCircleIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="font-bold text-black text-xl sm:text-2xl dark:text-white">
                +9.8%
              </div>
              <div className="font-normal text-gray-500 text-sm dark:text-gray-400">
                Last 30D Average
              </div>
            </div>
          </div>
        </div>
        <div className="relative max-w-lg">
          <NetTradingGainChart className="h-auto w-full" />

          <div className="absolute top-[38%] right-[-1.5%]">
            <div className="h-4 w-4 rounded-full border-4 border-[#7883F4] bg-[#F1F3FE]" />
          </div>

          <div className="absolute top-[57%] right-[-1.5%]">
            <div className="h-4 w-4 rounded-full border-4 border-gray-500 bg-gray-100" />
          </div>
          <div className="absolute top-5 right-6 hidden w-[220px] transform rounded-lg border border-gray-200 bg-white/40 p-3 backdrop-blur-sm lg:block dark:border-gray-700 dark:bg-gray-800/40">
            <div className="flex flex-col gap-2">
              <div className="font-normal text-[10px] text-gray-600 tracking-tight dark:text-gray-400">
                Jun 30, 2024
              </div>

              <div className="flex w-full flex-col gap-3">
                <div className="w-full rounded-[20px] bg-blue-50 px-2 py-1 text-center font-medium text-[10px] text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  Net Trading Gain: +5.6%
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                    <span className="font-medium text-blue-600 text-xs tracking-tight dark:text-blue-400">
                      Holding Blade LP
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="font-medium text-black text-sm tracking-tight dark:text-white">
                      $10,212.47
                    </div>
                    <div className="font-normal text-green-500 text-xs tracking-tight dark:text-green-400">
                      +$212.47
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400" />
                    <span className="font-medium text-gray-500 text-xs tracking-tight dark:text-gray-400">
                      Holding 50% USD & 50% ETH
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-black text-sm tracking-tight dark:text-white">
                      $8,134.12
                    </div>
                    <div className="font-normal text-gray-600 text-xs tracking-tight dark:text-gray-400">
                      <span className="text-red-500 dark:text-red-400">
                        -$1,865.88
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 hidden text-center font-normal text-gray-500 text-sm lg:block dark:text-gray-400">
          *The initial investment is $10,000 at the start of the 30-day period.
        </div>
        <div className="mt-6 space-y-4 lg:hidden">
          <div className="mb-4 text-center text-blue-600 text-xs dark:text-blue-400">
            Jun 30, 2024 - Net Trading Gain: +5.6%
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-900/30">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span className="font-medium text-blue-600 text-sm dark:text-blue-400">
                  Holding Blade LP
                </span>
              </div>
              <div className="text-right">
                <div className="font-medium text-black text-sm dark:text-white">
                  $10,212.47
                </div>
                <div className="text-green-500 text-xs dark:text-green-400">
                  +$212.47
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-500 dark:bg-gray-400" />
                <span className="font-medium text-gray-500 text-sm dark:text-gray-400">
                  Holding 50% USD & 50% ETH
                </span>
              </div>
              <div className="text-right">
                <div className="font-medium text-black text-sm dark:text-white">
                  $8,134.12
                </div>
                <div className="text-red-500 text-xs dark:text-red-400">
                  -$1,865.88
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-gray-500 text-xs dark:text-gray-400">
            *The initial investment is $10,000 at the start of the 30-day
            period.
          </div>
        </div>
      </div>
    </div>
  )
}
