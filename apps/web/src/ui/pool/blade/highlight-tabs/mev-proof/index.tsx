'use client'

import { ArrowRightIcon } from '@heroicons/react/20/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import type { FC } from 'react'
import darkImage from '../../assets/blade-mev-proof-dark.png'
import lightImage from '../../assets/blade-mev-proof-light.png'

interface MevProofTabProps {
  pool: BladePool
}

export const MevProofTab: FC<MevProofTabProps> = () => {
  return (
    <div className="z-10 flex w-full flex-col items-center">
      <div className="w-full rounded-2xl bg-white p-4 sm:p-6 md:p-8 dark:bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-bold text-xl sm:text-2xl">
              Formula Market Maker (FMM) → MEV-Proof
            </h2>
            <p className="max-w-xl text-base text-gray-600 dark:text-slate-400">
              Blade's novel Formula Market Maker (FMM) design uses both the
              token ratios in pools and decentralized price oracles to balance
              assets instead of a constant function, which means:
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <img
              src={lightImage.src}
              alt="blade-mev-proof"
              className="h-auto w-full dark:hidden"
            />
            <img
              src={darkImage.src}
              alt="blade-mev-proof"
              className="hidden h-auto w-full dark:block"
            />
          </div>

          <Button
            variant="secondary"
            className="flex items-center gap-2.5 rounded-full bg-[#3D657C0A] px-4 py-2 shadow-sm dark:bg-gray-800"
          >
            <span className="font-medium text-gray-700 text-sm tracking-tight sm:text-base dark:bg-gradient-to-r dark:from-[#B5E8FC] dark:to-[#D7A8E9] dark:bg-clip-text dark:text-transparent">
              Learn more about Blade's FMM Design
            </span>
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#22485D] dark:bg-gradient-to-r dark:from-[#B5E8FC] dark:to-[#D7A8E9]">
              <ArrowRightIcon className="h-3 w-3 text-gray-100 dark:text-gray-900" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
