import { SearchIcon } from '@heroicons/react/outline'
import { XCircleIcon } from '@heroicons/react/solid'
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
                  'ring-offset-2 ring-offset-slate-900 flex gap-2 bg-slate-800 pr-3 w-full relative flex items-center justify-between gap-1 rounded-xl focus-within:ring-2 text-primary ring-blue'
                )}
              >
                <Input.Address
                  id="token-search"
                  ref={inputRef}
                  placeholder="Search token by address"
                  value={query}
                  onChange={onInput}
                  className={classNames(
                    '!pr-0 !border-none !ring-offset-0 !shadow-none font-bold placeholder:font-medium !ring-0 w-full'
                  )}
                />
                {searching ? (
                  <div className="relative left-[-2px]">
                    <Loader size="14px" strokeWidth={3} className="animate-spin-slow text-slate-500" />
                  </div>
                ) : query ? (
                  <XCircleIcon
                    width={20}
                    height={20}
                    className="cursor-pointer text-slate-500 hover:text-slate-300"
                    onClick={() => onInput('')}
                  />
                ) : (
                  <SearchIcon className="text-slate-500" strokeWidth={2} width={20} height={20} />
                )}
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
