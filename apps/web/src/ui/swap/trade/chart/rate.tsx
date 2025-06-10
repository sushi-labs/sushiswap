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

  const rate = base.usdPrice / quote.usdPrice

  return (
    <div className="flex items-center space-x-2 text-sm font-medium text-[#0F172A] dark:text-white">
      <span>
        1 {base.symbol} (${base.usdPrice.toFixed(2)}) = {rate.toFixed(2)}{' '}
        {quote.symbol} (${quote.usdPrice.toFixed(2)})
      </span>
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="transition hover:opacity-75"
      >
        <ArrowsLeftRightIcon />
      </button>
    </div>
  )
}
