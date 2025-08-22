'use client'

import { Button, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useRef, useState } from 'react'
import { formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/chain'
import { evmChains } from 'sushi/chain'
import { useOverflow } from '../lp-positions-table/trending'

export const PortfolioSubHeader = () => {
  const overflowRef = useRef<HTMLDivElement>(null)
  const { hasOverflow } = useOverflow(overflowRef)

  const [selectedChainId, setSelectedChainId] = useState<EvmChainId | null>(
    null,
  )

  return (
    <div
      className="flex overflow-x-auto gap-2 pt-5 snap-x hide-scrollbar"
      ref={overflowRef}
    >
      <AssetItem
        chainId={1}
        selected={selectedChainId === 1}
        usdValue={12342}
        onSelect={(chainId) => setSelectedChainId(chainId)}
      />
      <AssetItem
        chainId={137}
        selected={selectedChainId === 137}
        usdValue={633}
        onSelect={(chainId) => setSelectedChainId(chainId)}
      />
      <AssetItem
        chainId={10}
        selected={selectedChainId === 10}
        usdValue={3810}
        onSelect={(chainId) => setSelectedChainId(chainId)}
      />
      {hasOverflow ? (
        <div className="h-full z-10 w-20 bg-gradient-to-r absolute right-0 top-1/2 -translate-y-1/2 from-transparent to-85% to-white dark:to-slate-900" />
      ) : null}
    </div>
  )
}

const AssetItem = ({
  chainId,
  selected,
  usdValue,
  onSelect,
}: {
  chainId: EvmChainId
  selected: boolean
  usdValue: number
  onSelect: (chainId: EvmChainId) => void
}) => {
  return (
    <Button
      key={`asset-item-${chainId}`}
      variant={'secondary'}
      type="button"
      className={classNames(
        '!rounded-xl gap-2.5 flex w-fit py-2 px-3 !justify-start !pl-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent',
        selected && '!bg-[#4217FF14] border border-[#4217FF]',
      )}
      onClick={() => onSelect(chainId)}
    >
      <NetworkIcon
        type="square"
        className="rounded-[4px] border border-slate-50 dark:border-slate-900"
        chainId={chainId}
        width={20}
        height={20}
      />

      <div className="flex gap-1 items-start">
        <span>{evmChains[chainId].name}</span>
        <span>{formatUSD(usdValue)}</span>
      </div>
    </Button>
  )
}
