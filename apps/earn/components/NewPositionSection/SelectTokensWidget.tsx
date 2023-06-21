import React, { FC } from 'react'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'
import { Button } from '@sushiswap/ui/future/components/button'
import { ContentBlock } from '../AddPage/ContentBlock'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { SelectIcon } from '@sushiswap/ui/future/components/select'

interface SelectTokensWidget {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  setToken0(token: Type): void
  setToken1(token: Type): void
}

export const SelectTokensWidget: FC<SelectTokensWidget> = ({ chainId, token0, token1, setToken0, setToken1 }) => {
  return (
    <ContentBlock
      title={
        <>
          Which <span className="text-gray-900 dark:text-white">token pair</span> would you like to add liquidity to?
        </>
      }
    >
      <div className="flex gap-3">
        <TokenSelector id={'token0-token-selector'} selected={token0} chainId={chainId} onSelect={setToken0}>
          {({ setOpen }) => (
            <Button
              variant="secondary"
              id={'token0-select-button'}
              testId={'token0-select'}
              onClick={() => setOpen(true)}
            >
              {token0 ? (
                <>
                  <Currency.Icon disableLink currency={token0} width={16} height={16} />
                  {token0.symbol}
                </>
              ) : (
                'Select Token'
              )}
              <SelectIcon />
            </Button>
          )}
        </TokenSelector>
        <TokenSelector id={'token1-token-selector'} selected={token1} chainId={chainId} onSelect={setToken1}>
          {({ setOpen }) => (
            <Button
              variant="secondary"
              color={!token1 ? 'blue' : 'default'}
              id={'token1-select-button'}
              testId={'token1-select'}
              onClick={() => setOpen(true)}
            >
              {token1 ? (
                <>
                  <Currency.Icon disableLink currency={token1} width={16} height={16} />
                  {token1.symbol}
                </>
              ) : (
                'Select Token'
              )}
              <SelectIcon />
            </Button>
          )}
        </TokenSelector>
      </div>
    </ContentBlock>
  )
}
