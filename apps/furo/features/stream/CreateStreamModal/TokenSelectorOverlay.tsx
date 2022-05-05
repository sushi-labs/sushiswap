import { FC, Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { classNames, Input, Select } from '@sushiswap/ui'
import { useAllTokens, useToken } from 'hooks'
import { Currency, Token } from '@sushiswap/currency'
import { Transition } from '@headlessui/react'
import { Dialog } from '@sushiswap/ui/dialog'
import { CurrencyList } from '.'
import { useDebounce } from '@sushiswap/hooks'
import { filterTokens, useSortedTokensByQuery } from '@sushiswap/hooks/dist/useSortedTokensByQuery'
import Loader from '@sushiswap/ui/loader/Loader'

interface Props {
  currency?: Token
  onSelect(x: Token): void
}

export const TokenSelectorOverlay: FC<Props> = ({ onSelect, currency }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string>('')
  const tokens = useAllTokens()
  const debouncedQuery = useDebounce(query, 400)
  const searching = useRef<boolean>(false)
  const searchToken = useToken(debouncedQuery)

  const handleSelect = useCallback(
    (currency: Currency) => {
      onSelect(currency.wrapped)
      setOpen(false)
    },
    [onSelect],
  )

  const filteredTokens: Token[] = useMemo(() => {
    const filtered = filterTokens(Object.values(tokens), debouncedQuery)
    searching.current = false

    if (searchToken) return [searchToken, ...filtered]
    return filtered
  }, [searchToken, tokens, debouncedQuery])

  const filteredSortedTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  return (
    <>
      <div className="flex flex-col gap-2 flex-grow">
        <Select.Label standalone>Token</Select.Label>
        <Select.Button standalone className="!cursor-pointer" onClick={() => setOpen(true)}>
          {currency?.symbol}
        </Select.Button>
      </div>
      <div
        className={classNames(open ? '' : 'hidden pointer-events-none', 'absolute inset-0 overflow-hidden h-full z-10')}
      >
        <Transition
          show={open}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-[-100%]"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-[-100%]"
          as={Fragment}
          unmount={false}
        >
          <Dialog.Content className="!space-y-5 !my-0 h-full">
            <Dialog.Header title="Select Token" onBack={() => setOpen(false)} onClose={() => setOpen(false)} />
            <div className="flex relative justify-between gap-1 bg-dark-800 rounded-xl items-center pr-4 focus-within:ring-1 ring-offset-2 ring-offset-dark-900 ring-blue">
              <Input.Address
                placeholder="Search token by address"
                value={query}
                onChange={(val) => {
                  searching.current = true
                  setQuery(val)
                }}
                className="text-sm font-bold placeholder:font-medium !ring-0"
              />
              {searching.current && <Loader width={24} height={24} />}
            </div>
            <CurrencyList currency={currency} onCurrency={handleSelect} currencies={filteredSortedTokens} />
          </Dialog.Content>
        </Transition>
      </div>
    </>
  )
}
