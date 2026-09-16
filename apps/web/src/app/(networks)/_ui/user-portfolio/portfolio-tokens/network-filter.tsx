import { Select, SelectContent, SelectItem, SelectTrigger } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import type { ReactElement } from 'react'
import { type ChainId, getChainById } from 'sushi'

export type NetworkFilterType = 'All' | ChainId

export function NetworkFilter({
  options,
  selectedChainId,
  onSelectChainId,
}: {
  selectedChainId: NetworkFilterType
  onSelectChainId: (chainId: NetworkFilterType) => void
  options: NetworkFilterType[]
}): ReactElement {
  return (
    <Select
      value={String(selectedChainId)}
      onValueChange={(value) => {
        const option = options.find((option) => String(option) === value)
        if (option !== undefined) onSelectChainId(option)
      }}
    >
      <SelectTrigger
        aria-label="Filter by network"
        className="!w-fit shrink-0 !border !border-accent text-sm !bg-white/[0.04] !text-perps-muted focus:!border-perps-blue"
      >
        {selectedChainId === 'All' ? (
          'All'
        ) : (
          <div className="flex items-center gap-2">
            <NetworkIcon chainId={selectedChainId} width={16} height={16} />
          </div>
        )}
      </SelectTrigger>

      <SelectContent className="!bg-black/30 backdrop-blur-2xl">
        {options.map((option) => (
          <SelectItem key={option} value={String(option)}>
            {option === 'All' ? (
              'All'
            ) : (
              <div className="flex items-center gap-2">
                <NetworkIcon chainId={option} width={16} height={16} />
                {getChainById(option).name}
              </div>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
