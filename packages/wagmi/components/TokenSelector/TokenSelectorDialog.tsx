import { Type } from '@sushiswap/currency'
import { classNames, Currency, Dialog, Input, Loader } from '@sushiswap/ui'
import { FC, useCallback } from 'react'

import { TokenListFilterByQuery } from '../TokenListFilterByQuery'
import { TokenSelectorProps } from './TokenSelector'

export const TokenSelectorDialog: FC<Omit<TokenSelectorProps, 'variant'>> = ({
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
        <Dialog open={open} unmount={false} onClose={onClose} afterEnter={() => inputRef.current?.focus()}>
          <Dialog.Content className="!max-w-sm !p-0 !space-y-0">
            <Dialog.Header onClose={onClose} title="Select Token" className="p-6 pb-5" />
            <div className="px-6 pb-5">
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
                    '!border-none !ring-offset-0 !shadow-none font-bold placeholder:font-medium !ring-0 w-full'
                  )}
                />
                {searching && <Loader size="16px" />}
              </div>
            </div>
            <Currency.List
              rowClassName="!px-5"
              className="min-h-[320px] rounded-t-none border-t border-slate-200/5"
              currency={currency}
              onCurrency={handleSelect}
              currencies={currencies}
            />
          </Dialog.Content>
        </Dialog>
      )}
    </TokenListFilterByQuery>
  )
}
