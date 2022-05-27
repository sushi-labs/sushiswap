import { Transition } from '@headlessui/react'
import { Token, Type } from '@sushiswap/currency'
import { useDebounce } from '@sushiswap/hooks'
import { filterTokens, useSortedTokensByQuery } from '@sushiswap/hooks/dist/useSortedTokensByQuery'
import { Currency, Dialog, Input, Loader } from '@sushiswap/ui'
import { useAllTokens, useToken } from 'hooks'
import { FC, Fragment, useCallback, useMemo, useRef, useState } from 'react'

interface Props {
  currency?: Token
  onSelect(x: Token): void
  onClose(): void
}

export const TokenSelector: FC<Props> = ({ onSelect, currency, onClose }) => {
  const [query, setQuery] = useState<string>('')
  const tokens = useAllTokens()
  const debouncedQuery = useDebounce(query, 400)
  const searching = useRef<boolean>(false)
  const searchToken = useToken(debouncedQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelect = useCallback(
    (currency: Type) => {
      onSelect(currency.wrapped)
      onClose()
    },
    [onSelect]
  )

  const filteredTokens: Token[] = useMemo(() => {
    const filtered = filterTokens(Object.values(tokens), debouncedQuery)
    searching.current = false

    if (searchToken) return [searchToken, ...filtered]
    return filtered
  }, [searchToken, tokens, debouncedQuery])

  const filteredSortedTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  return (
    <Transition
      enter="transform transition ease-in-out duration-300"
      enterFrom="translate-x-[-100%]"
      enterTo="translate-x-0"
      leave="transform transition ease-in-out duration-500"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-[-100%]"
      as={Fragment}
      afterEnter={() => inputRef.current?.focus()}
    >
      <Dialog.Content className="!space-y-5 fixed inset-0 !my-0 h-full !rounded-r-none">
        <Dialog.Header title="Select Token" onClose={onClose} />
        <div className="relative flex items-center justify-between gap-1 pr-4 bg-slate-800 rounded-xl focus-within:ring-1 ring-offset-2 ring-offset-slate-900 ring-blue">
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
          {searching.current && <Loader size="24px" />}
        </div>
        <Currency.List currency={currency} onCurrency={handleSelect} currencies={filteredSortedTokens} />
      </Dialog.Content>
    </Transition>
  )
}
