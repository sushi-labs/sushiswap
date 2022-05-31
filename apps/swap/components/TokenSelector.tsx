import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { classNames, Currency, Input, Loader, SlideIn } from '@sushiswap/ui'
import { TokenListFilterByQuery } from '@sushiswap/wagmi'
import { FC, useCallback } from 'react'

import { Theme } from '../types'
import { OverlayContent, OverlayHeader } from './Overlay'

interface Props {
  currency?: Type
  open: boolean
  chainId?: ChainId
  tokenMap: Record<string, Token>
  onClose(): void
  onSelect(currency: Type): void
  theme: Theme
}

export const TokenSelector: FC<Props> = ({ theme, currency, open, onClose, tokenMap, chainId, onSelect }) => {
  const handleSelect = useCallback(
    (currency: Type) => {
      onSelect(currency)
      onClose()
    },
    [onClose, onSelect]
  )

  return (
    <TokenListFilterByQuery tokenMap={tokenMap} chainId={chainId}>
      {({ currencies, inputRef, query, onInput, searching }) => (
        <SlideIn.FromLeft show={open} unmount={false} onClose={onClose} afterEnter={() => inputRef.current?.focus()}>
          <OverlayContent theme={theme}>
            <OverlayHeader onClose={onClose} title="Select Token" theme={theme} />
            <div
              className={classNames(
                theme.background.secondary,
                'w-full relative flex items-center justify-between gap-1 pr-4 rounded-xl focus-within:ring-2 text-primary'
              )}
              style={{ '--tw-ring-color': theme.accent }}
            >
              <Input.Address
                ref={inputRef}
                placeholder="Search token by address"
                value={query}
                onChange={onInput}
                className={classNames(
                  theme.primary.default,
                  theme.primary.hover,
                  '!border-none !ring-offset-0 !shadow-none font-bold placeholder:font-medium !ring-0 w-full'
                )}
              />
              {searching && <Loader size="16px" />}
            </div>
            <Currency.List
              className="lg:!max-h-[calc(100%-92px)]"
              currency={currency}
              onCurrency={handleSelect}
              currencies={currencies}
            />
          </OverlayContent>
        </SlideIn.FromLeft>
      )}
    </TokenListFilterByQuery>
  )
}
