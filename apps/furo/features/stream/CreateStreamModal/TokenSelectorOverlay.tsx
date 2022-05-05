import { FC, Fragment, useCallback, useState } from 'react'
import { classNames, Input, Select } from '@sushiswap/ui'
import { useAllTokens } from 'hooks'
import { Currency, Token } from '@sushiswap/currency'
import { Transition } from '@headlessui/react'
import { Dialog } from '@sushiswap/ui/dialog'
import { CurrencyList } from '.'

interface Props {
  currency?: Token
  onSelect(x: Token): void
}

export const TokenSelectorOverlay: FC<Props> = ({ onSelect, currency }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string>('')
  const tokens = useAllTokens()

  const handleSelect = useCallback(
    (currency: Currency) => {
      onSelect(currency.wrapped)
      setOpen(false)
    },
    [onSelect],
  )

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
            <Input.Address value={query} onChange={setQuery} className="text-sm font-bold placeholder:font-medium" />
            <CurrencyList currency={currency} onCurrency={handleSelect} currencies={Object.values(tokens)} />
          </Dialog.Content>
        </Transition>
      </div>
    </>
  )
}
