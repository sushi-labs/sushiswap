'use client'
import { ChevronDownIcon } from '@heroicons/react-v1/outline'
import {
  Button,
  Chip,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  SkeletonBox,
} from '@sushiswap/ui'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/UnknownTokenIcon'
import { useEffect, useMemo, useState } from 'react'
import { getHyperliquidCoinIconUrl } from 'src/lib/perps'
import { useAssetState } from '../trade-widget'
import { useAssetSelectorState } from './asset-selector-provider'
import { AssetTabs } from './asset-tabs'
import { SearchBar } from './search-bar'

export const AssetSelector = () => {
  const {
    state: { asset },
  } = useAssetState()

  const {
    state: { open },
    mutate: { setOpen },
  } = useAssetSelectorState()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {!asset ? (
          <TriggerSkeleton />
        ) : (
          <Button
            aria-label="Asset Selector"
            variant="ghost"
            className="whitespace-nowrap hover:!bg-transparent !px-0 lg:!rounded-full items-center !h-fit !gap-1"
            asChild
          >
            <span className="block lg:hidden">
              <TokenIcon />
            </span>
            <div className="whitespace-nowrap flex flex-col lg:flex-row lg:items-center lg:gap-2">
              <div className="flex items-center gap-1">
                <span className="hidden lg:block">
                  <TokenIcon />
                </span>
                <span className="text-lg font-medium">{asset?.symbol}</span>
              </div>
              <div className="flex items-center gap-1 ">
                <Chip
                  variant="perps-blue"
                  className="!px-1 !py-0 rounded-md ml-1"
                  data-glow="true"
                >
                  {asset?.maxLeverage ? `${asset.maxLeverage}x` : 'Spot'}
                </Chip>
                {asset?.dex ? (
                  <Chip
                    variant="perps-blue"
                    className="!px-1 !py-0 rounded-md ml-1"
                  >
                    {asset.dex}
                  </Chip>
                ) : null}
              </div>
            </div>
            <Button
              variant="perps-secondary"
              size="xs"
              className="!px-1 ml-2 lg:ml-1 !rounded-lg"
              aria-label="Asset Selector Chevron"
            >
              <ChevronDownIcon width={20} height={20} />
            </Button>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2 p-3 !backdrop-blur-2xl !border-2  !max-w-[calc(100vw-15px)] !border-[#7D95A9]">
        <SearchBar />
        <AssetTabs />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const TokenIcon = () => {
  const {
    state: { asset },
  } = useAssetState()
  const [imageErr, setImageErr] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset imageErr on asset change
  useEffect(() => {
    setImageErr(false)
  }, [asset?.symbol])

  const url = useMemo(() => {
    return getHyperliquidCoinIconUrl(asset)
  }, [asset])

  return (
    <>
      {imageErr ? (
        <UnknownTokenIcon className="w-6 h-6" />
      ) : (
        <img
          src={url}
          alt={asset?.symbol}
          className="w-6 h-6 rounded-full"
          onLoadStart={() => {
            setImageErr(false)
          }}
          onError={() => {
            setImageErr(true)
          }}
        />
      )}
    </>
  )
}

const TriggerSkeleton = () => {
  return (
    <Button
      variant="secondary"
      className="whitespace-nowrap lg:!rounded-full !h-fit !gap-1"
    >
      <div className="whitespace-nowrap flex flex-col lg:flex-row lg:items-center gap-1">
        <div className="flex items-center gap-1">
          <SkeletonBox className="w-6 h-6 min-w-[24px] !rounded-full" />
          <SkeletonBox className="w-24 h-7" />
          <ChevronDownIcon className="block lg:hidden" width={20} height={20} />
        </div>
        <div className="flex items-center gap-1">
          <SkeletonBox className="w-8 h-4 !rounded-[4px]" />
        </div>
      </div>
      <ChevronDownIcon className="hidden lg:block" width={20} height={20} />
    </Button>
  )
}
