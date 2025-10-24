'use client'

import { Button, SkeletonBox, classNames } from '@sushiswap/ui'
import { FourSquaresIcon } from '@sushiswap/ui/icons/FourSquaresIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useWalletPortfolioOverview } from 'src/lib/wagmi/hooks/portfolio/use-wallet-portfolio-overview'
import { formatUSD } from 'sushi'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import {
  DEFAULT_ASSET_NETWORKS,
  useChartFilters,
  useSetChartFilters,
} from '~evm/[chainId]/portfolio/chart-filters-provider'
import { useOverflow } from '../lp-positions-table/trending'

export const PortfolioSubHeader = () => {
  const { totalValueUSD, chains, isLoading } = useWalletPortfolioOverview()
  const overflowRef = useRef<HTMLDivElement>(null)
  const { chartNetworks } = useChartFilters()
  const setFilters = useSetChartFilters()
  const { hasOverflow } = useOverflow(overflowRef)
  const [isAtEnd, setIsAtEnd] = useState(false)

  useEffect(() => {
    const el = overflowRef.current
    if (!el) return

    const handleScroll = () => {
      const tolerance = 2
      const reachedEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - tolerance
      setIsAtEnd(reachedEnd)
    }

    el.addEventListener('scroll', handleScroll)
    handleScroll() // run once on mount
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

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
    <div className="relative w-full">
      <div
        ref={overflowRef}
        className="flex overflow-x-auto gap-2 pt-5 max-w-full snap-x hide-scrollbar"
      >
        <Button
          key={`asset-item-all`}
          variant="secondary"
          type="button"
          className={classNames(
            '!rounded-xl gap-2.5 flex w-fit py-2 px-3 !justify-start !pl-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent',
            selectedChainId === 'all'
              ? '!bg-[#4217FF14] dark:!bg-[#3DB1FF14] border border-blue dark:border-skyblue'
              : 'dark:!bg-slate-750',
          )}
          onClick={handleSelectAll}
        >
          <FourSquaresIcon
            width={16}
            height={16}
            className={classNames(
              'ml-2',
              selectedChainId === 'all'
                ? 'text-blue dark:!text-skyblue'
                : 'text-slate-900 dark:text-white',
            )}
          />
          <div className="flex gap-1 items-start">
            <span>All</span>
            {isLoading ? (
              <SkeletonBox className="w-[50px] h-4 mt-0.5" />
            ) : (
              <span>{formatUSD(totalValueUSD ?? 0)}</span>
            )}
          </div>
        </Button>

        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBox key={index} className="w-[145px] h-10" />
            ))
          : chains.map((chain) => (
              <AssetItem
                key={chain.chainId}
                chainId={chain.chainId}
                selected={selectedChainId === chain.chainId}
                usdValue={chain.totalValueUSD}
                onSelect={handleSelectChain}
              />
            ))}
      </div>
      <div
        className={classNames(
          'pointer-events-none absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-background dark:to-slate-900 transition-opacity duration-200 ease-out',
          hasOverflow && !isAtEnd ? 'opacity-100' : 'opacity-0',
        )}
      />
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
