'use client'

import { Button } from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { useState } from 'react'
import { Wrapper } from '../swap/trade/wrapper'

export const Statistics = () => {
  return (
    <Wrapper className="flex flex-col gap-6 !p-5 border basis-1/3 border-accent">
      <StatisticsHeader />
      <StatisticsContent />
    </Wrapper>
  )
}

const StatisticsHeader = () => {
  const [version, setVersion] = useState<'v2' | 'v3' | ''>('')
  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <span className="text-lg font-semibold">Statistics</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className={classNames(
            'rounded-xl border-dashed !bg-[#00000005] hover:!bg-[#F338C31A] hover:!border-[#F338C3] hover:!text-[#F338C3]',
            version === 'v2' &&
              '!bg-[#F338C31A] !border-[#F338C3] text-[#F338C3] hover:!text-[#F338C3] !border-solid',
          )}
          onClick={() => {
            setVersion(version === 'v2' ? '' : 'v2')
          }}
        >
          <span>V2</span>
        </Button>
        <Button
          variant="outline"
          className={classNames(
            'rounded-xl border-dashed !bg-[#00000005] hover:!bg-[#3B7EF61A] hover:!border-[#3B7EF6] hover:!text-[#3B7EF6]',
            version === 'v3' &&
              '!bg-[#3B7EF61A] !border-[#3B7EF6] text-[#3B7EF6] hover:!text-[#3B7EF6] !border-solid',
          )}
          onClick={() => {
            setVersion(version === 'v3' ? '' : 'v3')
          }}
        >
          <span>V3</span>
        </Button>
      </div>
    </div>
  )
}

const StatisticsContent = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 justify-between items-center lg:flex-col lg:items-start lg:justify-normal">
        <span className="font-medium text-muted-foreground">TVL (7d%)</span>
        <div className="flex gap-2 justify-between items-center lg:flex-col lg:items-start lg:justify-normal lg:gap-2">
          <p className="text-base lg:text-[1.75rem] font-semibold">$3.3b</p>
          <p className="text-sm text-red-500">-1.2%</p>
        </div>
      </div>
      <div className="flex gap-3 justify-between items-center lg:flex-col lg:items-start lg:justify-normal">
        <span className="font-medium text-muted-foreground">Volume (7d%)</span>
        <div className="flex gap-2 justify-between items-center lg:flex-col lg:items-start lg:justify-normal lg:gap-2">
          <p className="text-base lg:text-[1.75rem] font-semibold">$23.62m </p>
          <p className="text-sm text-green-500">+1.69%</p>
        </div>
      </div>
    </div>
  )
}
