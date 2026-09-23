'use client'

import { Currency } from '@sushiswap/ui'
import { EvmChainId, SUSHI } from 'sushi/evm'

export const Hero = () => {
  return (
    <div className="flex flex-col md:gap-2">
      <div className="flex items-center gap-3">
        <span className="block md:hidden">
          <Currency.Icon
            currency={SUSHI[EvmChainId.ETHEREUM]}
            width={36}
            height={36}
          />
        </span>
        <span className="hidden md:block">
          <Currency.Icon
            currency={SUSHI[EvmChainId.ETHEREUM]}
            width={52}
            height={52}
          />
        </span>

        <h1 className="text-3xl md:text-5xl font-bold">
          Buyback & Strategic Reserve
        </h1>
      </div>
      <p className="md:text-xl !max-w-[790px] text-muted-foreground">
        Sushi uses 4% of protocol fees to purchase SUSHI weekly and hold it in a
        protocol-controlled strategic reserve. Track reserve holdings and each
        purchase below.
      </p>
    </div>
  )
}
