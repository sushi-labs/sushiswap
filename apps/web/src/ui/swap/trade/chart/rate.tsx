'use client'

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
}

export const Rate: React.FC<RateProps> = ({ token0, token1 }) => {
  const [flipped, setFlipped] = useState(false)

  const base = flipped ? token1 : token0
  const quote = flipped ? token0 : token1

  // const rate = base.usdPrice / quote.usdPrice;

  return (
    <div className="flex items-center flex-wrap text-sm font-medium text-[#0F172A] dark:text-white">
      <div className="mr-1">
        1 {base.symbol} = ${base.usdPrice.toFixed(2)}
      </div>
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="transition hover:opacity-75 text-blue dark:text-skyblue flex items-center gap-1"
      >
        <ArrowsLeftRightIcon width={18} />
        Switch To {quote.symbol}
      </button>
    </div>
  )
}
