import { Type } from '@sushiswap/currency'
import { classNames, Currency, Input, Loader, Overlay, SlideIn } from '@sushiswap/ui'
import { FC, useCallback } from 'react'

import { TokenListFilterByQuery } from '../TokenListFilterByQuery'
import { TokenSelectorProps } from './TokenSelector'

export const TokenSelectorOverlay: FC<Omit<TokenSelectorProps, 'variant'>> = ({
  currency,
  open,
  onClose,
  tokenMap,
  chainId,
  onSelect,
}) => {
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
          <Overlay.Content className="bg-slate-800 !p-0">
            <Overlay.Header onClose={onClose} title="Select Token" className="p-3 pb-0" />
            <div className="px-3">
              <div
                className={classNames(
                  'w-full relative flex items-center justify-between gap-1 rounded-xl focus-within:ring-2 text-primary'
                )}
              >
                <Input.Address
                  id="token-search"
                  ref={inputRef}
                  placeholder="Search token by address"
                  value={query}
                  onChange={onInput}
                  className={classNames(
                    '!bg-slate-700 !border-none !ring-offset-0 !shadow-none font-bold placeholder:font-medium !ring-0 w-full'
                  )}
                />
                {searching && <Loader size="16px" />}
              </div>
            </div>
            <Currency.List
              className="lg:!max-h-[calc(100%-92px)] rounded-t-none bg-slate-800 border-t border-slate-200/5"
              currency={currency}
              onCurrency={handleSelect}
              currencies={currencies}
            />
          </Overlay.Content>
        </SlideIn.FromLeft>
      )}
    </TokenListFilterByQuery>
  )
}
