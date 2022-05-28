import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { Currency, Dialog, Input, Loader } from '@sushiswap/ui'
import { TokenListFilterByQuery } from '@sushiswap/wagmi'
import { FC } from 'react'

interface Props {
  tokenMap: Record<string, Token>
  chainId: ChainId | undefined
  currency: Token | undefined
  onSelect(x: Type): void
  onClose(): void
}

export const TokenSelector: FC<Props> = ({ tokenMap, chainId, onSelect, currency, onClose }) => {
  return (
    <TokenListFilterByQuery tokenMap={tokenMap} chainId={chainId} includeNative={true}>
      {({ currencies, inputRef, query, onInput, searching }) => (
        <Dialog.Content className="!space-y-5 fixed inset-0 !my-0 h-full !rounded-r-none">
          <Dialog.Header title="Select Token" onClose={onClose} />
          <div className="relative flex items-center justify-between gap-1 pr-4 bg-slate-800 rounded-xl focus-within:ring-1 ring-offset-2 ring-offset-slate-900 ring-blue">
            <Input.Address
              ref={inputRef}
              placeholder="Search token by address"
              value={query}
              onChange={onInput}
              className="!border-none !ring-offset-0 !shadow-none font-bold placeholder:font-medium !ring-0 w-full"
            />
            {searching && <Loader size="24px" />}
          </div>
          <Currency.List currency={currency} onCurrency={onSelect} currencies={currencies} />
        </Dialog.Content>
      )}
    </TokenListFilterByQuery>
  )
}
