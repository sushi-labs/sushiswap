'use client'

import { SkeletonBox } from '@sushiswap/ui'
import { ArrowsLeftRightIcon } from '@sushiswap/ui/icons/ArrowsLeftRight'
import { useState } from 'react'

type Token = {
  symbol: string
  amount: number
  usdPrice: number
}

interface RateProps {
  token0: Token
  token1: Token
  isLoading?: boolean
}

export const Rate: React.FC<RateProps> = ({ token0, token1, isLoading }) => {
  const [flipped, setFlipped] = useState(false)

  const base = flipped ? token1 : token0
  const quote = flipped ? token0 : token1

  return (
    <div className="flex items-center xl:flex-wrap text-sm font-medium text-[#0F172A] dark:text-white">
      {isLoading ? (
        <SkeletonBox className="w-20 h-4 mr-1 rounded-md" />
      ) : (
        <div className="mr-1">
          1 {base.symbol} = ${base.usdPrice.toFixed(2)}
        </div>
      )}
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="flex items-center gap-1 transition hover:opacity-75 text-blue dark:text-skyblue"
      >
        <ArrowsLeftRightIcon width={18} />
        Switch To {quote.symbol}
      </button>
    </div>
  )
}
