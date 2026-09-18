'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Button, Currency, LinkExternal, useBreakpoint } from '@sushiswap/ui'
import { EvmChainId, SUSHI } from 'sushi/evm'

export const Hero = () => {
  const { isMd } = useBreakpoint('md')
  return (
    <div className="flex flex-wrap justify-between items-end gap-3 md:gap-6">
      <div className="flex flex-col md:gap-2">
        <div className="flex items-center gap-3">
          <Currency.Icon
            currency={SUSHI[EvmChainId.ETHEREUM]}
            width={isMd ? 52 : 36}
            height={isMd ? 52 : 36}
          />

          <h1 className="text-3xl md:text-5xl font-bold">
            Buyback & Strategic Reserve
          </h1>
        </div>
        <p className="md:text-xl !max-w-[790px] text-muted-foreground">
          Sushi uses 4% of protocol fees to purchase SUSHI weekly and hold it in
          a protocol-controlled strategic reserve. Track reserve holdings and
          each purchase below.
        </p>
      </div>
      <div className="ml-auto md:ml-0">
        <LinkExternal href="https://app.safe.global/balances?safe=eth:0x33d785012eeCaB254700988E988048E044baC4F5">
          <Button
            asChild
            variant="outline"
            className="!text-primary !font-medium"
            iconPosition="end"
            iconProps={{ className: '!w-4 !h-4' }}
            icon={ArrowTopRightOnSquareIcon}
          >
            Reserve Safe
          </Button>
        </LinkExternal>
      </div>
    </div>
  )
}
