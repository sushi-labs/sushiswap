'use client'

import {
  Button,
  Currency,
  FormSection,
  SelectIcon,
  SkeletonCircle,
  SkeletonText,
} from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'
import type { TokenSelectorChainId } from 'src/lib/wagmi/components/token-selector/config'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'

interface SelectTokensWidgetProps<TChainId extends TokenSelectorChainId> {
  chainId: TChainId
  token0: CurrencyFor<TChainId> | undefined
  token1: CurrencyFor<TChainId> | undefined
  setToken0(token: CurrencyFor<TChainId>): void
  setToken1(token: CurrencyFor<TChainId>): void
  /** Shows a placeholder for a token that is still being resolved. */
  token0Loading?: boolean
  token1Loading?: boolean
  title?: string
  includeNative?: boolean
  children?: ReactNode
}

export function SelectTokensWidget<TChainId extends TokenSelectorChainId>({
  chainId,
  token0,
  token1,
  setToken0,
  setToken1,
  token0Loading,
  token1Loading,
  title = 'Tokens',
  includeNative,
  children,
}: SelectTokensWidgetProps<TChainId>): ReactElement {
  return (
    <FormSection
      title={title}
      description="Which token pair would you like to add liquidity to?"
    >
      <div className="flex flex-wrap gap-3">
        {[
          { token: token0, onSelect: setToken0, loading: token0Loading },
          { token: token1, onSelect: setToken1, loading: token1Loading },
        ].map(({ token, onSelect, loading }, index) => (
          <TokenSelector
            key={index}
            id={`token${index}-selector`}
            chainId={chainId}
            selected={token}
            onSelect={onSelect}
            includeNative={includeNative}
          >
            <Button
              type="button"
              variant="secondary"
              color={!token && !loading && index === 1 ? 'blue' : 'default'}
              id={`token${index}-select-button`}
              testId={`token${index}-select`}
              aria-label={`Select token ${index + 1}`}
            >
              {loading ? (
                <>
                  <SkeletonCircle radius={16} />
                  <div className="w-12">
                    <SkeletonText fontSize="sm" />
                  </div>
                </>
              ) : (
                <>
                  {token && (
                    <Currency.Icon
                      disableLink
                      currency={token}
                      width={16}
                      height={16}
                    />
                  )}
                  {token?.symbol ?? 'Select Token'}
                </>
              )}
              <SelectIcon />
            </Button>
          </TokenSelector>
        ))}
      </div>
      {children}
    </FormSection>
  )
}
