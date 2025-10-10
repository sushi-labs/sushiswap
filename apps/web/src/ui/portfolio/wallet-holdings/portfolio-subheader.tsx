'use client'

import { Button, classNames } from '@sushiswap/ui'
import { FourSquaresIcon } from '@sushiswap/ui/icons/FourSquaresIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo, useRef } from 'react'
import { formatUSD } from 'sushi'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import {
  DEFAULT_ASSET_NETWORKS,
  useChartFilters,
  useSetChartFilters,
} from '~evm/[chainId]/portfolio/chart-filters-provider'
import { useOverflow } from '../lp-positions-table/trending'

export const PortfolioSubHeader = () => {
  const overflowRef = useRef<HTMLDivElement>(null)
  const { hasOverflow } = useOverflow(overflowRef)
  const { chartNetworks } = useChartFilters()
  const setFilters = useSetChartFilters()

  const handleSelectAll = () => {
    setFilters((prev) => ({ ...prev, chartNetworks: DEFAULT_ASSET_NETWORKS }))
  }

  const handleSelectChain = (chainId: EvmChainId) => {
    // @ts-ignore
    // @dev fix until we have correct chain types
    setFilters((prev) => ({
      ...prev,
      chartNetworks: [chainId],
    }))
  }

  const selectedChainId = useMemo(() => {
    if (chartNetworks.length === 0) return 'all'
    if (chartNetworks.length === DEFAULT_ASSET_NETWORKS.length) return 'all'
    return chartNetworks[0]
  }, [chartNetworks])

  return (
    <div
      className="flex overflow-x-auto gap-2 pt-5 max-w-full snap-x hide-scrollbar"
      ref={overflowRef}
    >
      <Button
        key={`asset-item-all`}
        variant={'secondary'}
        type="button"
        className={classNames(
          '!rounded-xl gap-2.5 flex w-fit py-2 px-3 !justify-start !pl-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent',
          selectedChainId === 'all'
            ? '!bg-[#4217FF14] dark:!bg-[#3DB1FF14] border border-blue dark:border-skyblue'
            : ' dark:!bg-slate-750',
        )}
        onClick={handleSelectAll}
      >
        <FourSquaresIcon
          width={16}
          height={16}
          className={classNames(
            'ml-2  ',
            selectedChainId === 'all'
              ? 'text-blue dark:!text-skyblue'
              : 'text-slate-900 dark:text-white',
          )}
        />

        <div className="flex gap-1 items-start">
          <span>All</span>
          <span>{formatUSD(52526.96)}</span>
        </div>
      </Button>
      <AssetItem
        chainId={1}
        selected={selectedChainId === 1}
        usdValue={12342}
        onSelect={handleSelectChain}
      />
      <AssetItem
        chainId={137}
        selected={selectedChainId === 137}
        usdValue={633}
        onSelect={handleSelectChain}
      />
      <AssetItem
        chainId={10}
        selected={selectedChainId === 10}
        usdValue={3810}
        onSelect={handleSelectChain}
      />
      {hasOverflow ? (
        <div className="h-full z-10 w-20 bg-gradient-to-r absolute right-0 top-1/2 -translate-y-1/2 from-transparent to-85% to-white dark:to-slate-900 hidden md:block" />
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
        selected
          ? '!bg-[#4217FF14] dark:!bg-[#3DB1FF14] border border-blue dark:border-skyblue'
          : ' dark:!bg-slate-750',
      )}
      onClick={() => onSelect(chainId)}
    >
      <NetworkIcon
        type="square"
        className="rounded-[4px]"
        chainId={chainId}
        width={20}
        height={20}
      />

      <div className="flex gap-1 items-start">
        <span>{getEvmChainById(chainId).name}</span>
        <span>{formatUSD(usdValue)}</span>
      </div>
    </Button>
  )
}
