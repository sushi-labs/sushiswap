import { ContentBlock } from './ContentBlock'
import { Button } from '@sushiswap/ui/future/components/button'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { classNames } from '@sushiswap/ui'
import React from 'react'
import { useAddPositionActions, useAddPositionState } from './AddPositionProvider'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'
import { Currency } from '@sushiswap/ui/future/components/currency'

export const SelectTokensContentBlock = () => {
  const { chainId, token0, token1 } = useAddPositionState()
  const { setToken0 } = useAddPositionActions()
  const { setToken1 } = useAddPositionActions()

  return (
    <ContentBlock
      title={
        <>
          Choose the <span className="text-gray-900 dark:text-white">token pair</span> you would like to add liquidity
          to.
        </>
      }
    >
      <div className="flex gap-4">
        <TokenSelector id={`token0-token-selector`} selected={token0} chainId={chainId} onSelect={setToken0}>
          {({ open, setOpen }) => (
            <Button
              size="xl"
              variant="outlined"
              color="default"
              id={`token0-select-button`}
              onClick={() => setOpen(true)}
            >
              {token0 ? (
                <>
                  <div className="w-[28px] h-[28px] mr-0.5">
                    <Currency.Icon disableLink currency={token0} width={28} height={28} />
                  </div>
                  {token0.symbol}
                </>
              ) : (
                'Select Token'
              )}
              <ChevronDownIcon
                width={24}
                height={24}
                className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
              />
            </Button>
          )}
        </TokenSelector>
        <TokenSelector id={`token0-token-selector`} selected={token1} chainId={chainId} onSelect={setToken1}>
          {({ open, setOpen }) => (
            <Button
              size="xl"
              variant="outlined"
              color="default"
              id={`token0-select-button`}
              onClick={() => setOpen(true)}
            >
              {token1 ? (
                <>
                  <div className="w-[28px] h-[28px] mr-0.5">
                    <Currency.Icon disableLink currency={token1} width={28} height={28} />
                  </div>
                  {token1.symbol}
                </>
              ) : (
                'Select Token'
              )}
              <ChevronDownIcon
                width={24}
                height={24}
                className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
              />
            </Button>
          )}
        </TokenSelector>
      </div>
    </ContentBlock>
  )
}
