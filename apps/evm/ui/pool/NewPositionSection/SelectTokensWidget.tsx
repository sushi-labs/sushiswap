import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { SelectIcon } from '@sushiswap/ui/components/select'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'
import React, { FC } from 'react'

import { ContentBlock } from '../AddPage/ContentBlock'

interface SelectTokensWidget {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  setToken0(token: Type): void
  setToken1(token: Type): void
  title?: string
}

export const SelectTokensWidget: FC<SelectTokensWidget> = ({
  title,
  chainId,
  token0,
  token1,
  setToken0,
  setToken1,
}) => {
  return (
    <ContentBlock
      title={
        title ?? (
          <>
            Which <span className="text-gray-900 dark:text-white">token pair</span> would you like to add liquidity to?
          </>
        )
      }
    >
      <div className="flex gap-3">
        <TokenSelector id={'token0-token-selector'} selected={token0} chainId={chainId} onSelect={setToken0}>
          <Button variant="secondary" id={'token0-select-button'} testId={'token0-select'}>
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
        </TokenSelector>
        <TokenSelector id={'token1-token-selector'} selected={token1} chainId={chainId} onSelect={setToken1}>
          <Button
            variant="secondary"
            color={!token1 ? 'blue' : 'default'}
            id={'token1-select-button'}
            testId={'token1-select'}
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
        </TokenSelector>
      </div>
    </ContentBlock>
  )
}
