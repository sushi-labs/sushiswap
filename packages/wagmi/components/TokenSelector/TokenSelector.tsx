import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { useDebounce } from '@sushiswap/hooks'
import { filterTokens, useSortedTokensByQuery } from '@sushiswap/hooks/dist/useSortedTokensByQuery'
import { classNames, Currency, Dialog, Input, Loader, SlideIn } from '@sushiswap/ui'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { useToken } from 'wagmi'

interface Props {
  className?: string
  open: boolean
  chainId?: ChainId
  tokenMap: Record<string, Token>
  currency?: Type
  onSelect(x: Token): void
  onClose(): void
}

export const TokenSelector: FC<Props> = ({ className, open, chainId, tokenMap, onSelect, currency, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 400)
  const searching = useRef<boolean>(false)

  const { data: searchTokenResult } = useToken({ address: debouncedQuery })
  const searchToken = useMemo(() => {
    if (!searchTokenResult || !chainId) return undefined
    const { decimals, address, symbol } = searchTokenResult
    return new Token({ chainId, decimals, address, symbol })
  }, [chainId, searchTokenResult])

  const handleSelect = useCallback(
    (currency: Type) => {
      onSelect(currency.wrapped)
      onClose()
    },
    [onClose, onSelect]
  )

  const filteredTokens: Token[] = useMemo(() => {
    const filtered = filterTokens(Object.values(tokenMap), debouncedQuery)
    searching.current = false

    if (searchToken && chainId) {
      const { decimals, address, symbol } = searchToken
      const _searchToken = new Token({ chainId, decimals, address, symbol })
      return [_searchToken, ...filtered]
    }
    return filtered
  }, [tokenMap, debouncedQuery, searchToken, chainId])

  const filteredSortedTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  return (
    <SlideIn.FromLeft show={open} unmount={false} onClose={onClose} afterEnter={() => inputRef.current?.focus()}>
      <Dialog.Content className={classNames(className, '!p-3 !space-y-3 inset-0 !my-0 h-full')}>
        <Dialog.Header title="Select Token" onClose={onClose} onBack={onClose} />
        <div className="bg-slate-800 w-full relative flex items-center justify-between gap-1 pr-4 rounded-xl focus-within:ring-2 ring-blue">
          <Input.Address
            ref={inputRef}
            placeholder="Search token by address"
            value={query}
            onChange={(val: string) => {
              searching.current = true
              setQuery(val)
            }}
            className="!border-none !ring-offset-0 !shadow-none font-bold placeholder:font-medium !ring-0 w-full"
          />
          {searching.current && <Loader size="16px" />}
        </div>
        <Currency.List
          className="lg:!max-h-[calc(100%-92px)]"
          currency={currency}
          onCurrency={handleSelect}
          currencies={filteredSortedTokens}
        />
      </Dialog.Content>
    </SlideIn.FromLeft>
  )
}
