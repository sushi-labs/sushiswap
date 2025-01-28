import { FormSection } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { SelectIcon } from '@sushiswap/ui'
import React, { FC } from 'react'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { EvmChainId } from 'sushi/chain'
import { Type } from 'sushi/currency'

interface SelectTokensWidget {
  chainId: EvmChainId
  token0: Type | undefined
  token1: Type | undefined
  setToken0(token: Type): void
  setToken1(token: Type): void
  title?: string
  includeNative?: boolean
}

export const SelectTokensWidget: FC<SelectTokensWidget> = ({
  chainId,
  token0,
  token1,
  setToken0,
  setToken1,
  includeNative,
}) => {
  return (
    <FormSection
      title="Tokens"
      description="Which token pair would you like to add liquidity to."
    >
      <div className="flex gap-3">
        <TokenSelector
          selected={token0}
          chainId={chainId}
          onSelect={setToken0}
          includeNative={includeNative}
        >
          <Button
            variant="secondary"
            id={'token0-select-button'}
            testId={'token0-select'}
          >
            {token0 ? (
              <>
                <Currency.Icon
                  disableLink
                  currency={token0}
                  width={16}
                  height={16}
                />
                {token0.symbol}
              </>
            ) : (
              'Select Token'
            )}
            <SelectIcon />
          </Button>
        </TokenSelector>
        <TokenSelector
          selected={token1}
          chainId={chainId}
          onSelect={setToken1}
          includeNative={includeNative}
        >
          <Button
            variant="secondary"
            color={!token1 ? 'blue' : 'default'}
            id={'token1-select-button'}
            testId={'token1-select'}
          >
            {token1 ? (
              <>
                <Currency.Icon
                  disableLink
                  currency={token1}
                  width={16}
                  height={16}
                />
                {token1.symbol}
              </>
            ) : (
              'Select Token'
            )}
            <SelectIcon />
          </Button>
        </TokenSelector>
      </div>
    </FormSection>
  )
}
