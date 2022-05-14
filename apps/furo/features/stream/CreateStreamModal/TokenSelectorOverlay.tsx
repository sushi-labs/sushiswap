import { Transition } from '@headlessui/react'
import { Token,Type } from '@sushiswap/currency'
import { useDebounce } from '@sushiswap/hooks'
import { filterTokens, useSortedTokensByQuery } from '@sushiswap/hooks/dist/useSortedTokensByQuery'
import { classNames, Input, Select } from '@sushiswap/ui'
import { Currency, Dialog, Loader } from '@sushiswap/ui'
import { useAllTokens, useToken } from 'hooks'
import { FC, Fragment, useCallback, useMemo, useRef, useState } from 'react'

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
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelect = useCallback(
    (currency: Type) => {
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
      <div className="flex flex-col flex-grow gap-2">
        <Select.Label standalone>Token</Select.Label>
        <Select.Button standalone className="!cursor-pointer" onClick={() => setOpen(true)}>
          {currency?.symbol || <span className="text-slate-500">Select a token</span>}
        </Select.Button>
      </div>
      <Transition.Root show={open} unmount={false} as={Fragment}>
        <div className={classNames('!mt-0 absolute inset-0 overflow-hidden h-full z-10')}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-slate-700 backdrop-blur-[14px] bg-opacity-50 backdrop-saturate-[0.6] transition-opacity"
            />
          </Transition.Child>
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
            afterEnter={() => inputRef.current?.focus()}
          >
            <Dialog.Content className="!space-y-5 fixed inset-0 !my-0 h-full !rounded-r-none">
              <Dialog.Header title="Select Token" onBack={() => setOpen(false)} />
              <div className="relative flex items-center justify-between gap-1 pr-4 bg-slate-800 rounded-xl focus-within:ring-1 ring-offset-2 ring-offset-slate-900 ring-blue">
                <Input.Address
                  ref={inputRef}
                  placeholder="Search token by address"
                  value={query}
                  onChange={(val: string) => {
                    searching.current = true
                    setQuery(val)
                  }}
                  className="!border-none !ring-offset-0 !shadow-none text-sm font-bold placeholder:font-medium !ring-0 w-full"
                />
                {searching.current && <Loader width={24} height={24} />}
              </div>
              <Currency.List currency={currency} onCurrency={handleSelect} currencies={filteredSortedTokens} />
            </Dialog.Content>
          </Transition>
        </div>
      </Transition.Root>
    </>
  )
}
