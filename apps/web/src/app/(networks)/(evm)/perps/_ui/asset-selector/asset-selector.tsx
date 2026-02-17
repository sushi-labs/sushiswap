import { ChevronDownIcon } from '@heroicons/react-v1/outline'
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  SkeletonBox,
} from '@sushiswap/ui'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/UnknownTokenIcon'
import { useMemo } from 'react'
import { useAssetState } from '../trade-widget/asset-state-provider'
import { useAssetListState } from './asset-list-provider'
import { useAssetSelectorState } from './asset-selector-provider'
import { AssetTabs } from './asset-tabs'
import { SearchBar } from './search-bar'

export const AssetSelector = () => {
  const {
    state: { activeAsset },
  } = useAssetState()
  const {
    state: {
      assetListQuery: { data, isLoading },
    },
  } = useAssetListState()
  const {
    state: { open },
    mutate: { setOpen },
  } = useAssetSelectorState()
  const asset = useMemo(() => data?.get?.(activeAsset), [data, activeAsset])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isLoading || !asset ? (
          <TriggerSkeleton />
        ) : (
          <Button
            variant="secondary"
            className="whitespace-nowrap lg:!rounded-full !h-fit !gap-1"
          >
            <div className="whitespace-nowrap flex flex-col lg:flex-row lg:items-center gap-1">
              <div className="flex items-center gap-1">
                {/* todo: get token icon */}
                {/* <UnknownTokenIcon className="w-6 h-6" /> */}
                <img
                  src={`https://app.hyperliquid.xyz/coins/${asset?.marketType === 'spot' ? asset?.symbol?.split('/')?.[0] : asset?.name}${asset?.marketType === 'spot' ? '_spot' : ''}.svg`}
                  alt={asset?.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-lg font-medium">{asset?.symbol}</span>
                <ChevronDownIcon
                  className="block lg:hidden"
                  width={20}
                  height={20}
                />
              </div>
              <div className="flex items-center gap-1">
                <Chip variant="blue" className="!px-1">
                  {asset?.maxLeverage ? `${asset.maxLeverage}x` : 'Spot'}
                </Chip>
                {asset?.dex ? (
                  <Chip variant="blue" className="!px-1">
                    {asset.dex}
                  </Chip>
                ) : null}
              </div>
            </div>
            <ChevronDownIcon
              className="hidden lg:block"
              width={20}
              height={20}
            />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-3xl">
        <DialogHeader className="!text-left">
          <DialogTitle>Select Asset</DialogTitle>
          <DialogDescription>Select an asset to trade.</DialogDescription>
        </DialogHeader>

        <SearchBar />
        <AssetTabs />
      </DialogContent>
    </Dialog>
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
