import { CheckIcon } from '@heroicons/react/outline'
import chains, { Chain, ChainId } from '@sushiswap/chain'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, Dialog, Input, Loader, SlideIn, Typography } from '@sushiswap/ui'
import { FC, useCallback, useMemo, useRef, useState } from 'react'

interface NetworkSelector {
  open: boolean
  onClose(): void
  onSelect(network: ChainId): void
  selected: ChainId
  className?: string
  networks?: { [k: string]: Chain }
}

export const NetworkSelector: FC<NetworkSelector> = ({
  networks = chains,
  open,
  onClose,
  onSelect,
  selected,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>()
  const debouncedQuery = useDebounce(query, 200)
  const searching = useRef<boolean>(false)

  const handleSelect = useCallback(
    (chainId: ChainId) => {
      onSelect(chainId)
      onClose()

      setQuery(undefined)
    },
    [onClose, onSelect]
  )

  const filteredChains: [string, Chain][] = useMemo(() => {
    if (!debouncedQuery) {
      searching.current = false
      return Object.entries(networks)
    }

    searching.current = false
    return Object.entries(networks).filter(([k, v]) => v.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
  }, [networks, debouncedQuery])

  return (
    <SlideIn.FromLeft show={open} unmount={false} onClose={onClose}>
      <Dialog.Content className={classNames(className, '!p-3 !space-y-3 inset-0 !my-0 h-full')}>
        <Dialog.Header title="Select Network" onClose={onClose} onBack={onClose} />
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
        <div className="bg-slate-800 rounded-xl overflow-hidden h-[calc(100%-92px)]">
          <div className="h-full overflow-auto hide-scrollbar">
            {filteredChains.map(([k, chain]) => (
              <Typography
                onClick={() => handleSelect(chain.chainId)}
                key={chain.chainId}
                variant="sm"
                className={classNames(
                  selected === chain.chainId ? 'pl-1.5 text-slate-300 !font-bold' : 'pl-8 text-slate-400 !font-medium',
                  'flex gap-1.5 hover:bg-slate-800 cursor-pointer hover:text-slate-200 py-2 pr-3'
                )}
              >
                {selected === chain.chainId && <CheckIcon width={20} height={20} className="text-blue" />}
                {chain.name}
              </Typography>
            ))}
          </div>
        </div>
      </Dialog.Content>
    </SlideIn.FromLeft>
  )
}
