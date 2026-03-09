'use client'
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!asset ? (
          <TriggerSkeleton />
        ) : (
          <Button
            variant="secondary"
            className="whitespace-nowrap !px-2 lg:!px-3 lg:!rounded-full items-center !h-fit !gap-1"
          >
            <span className="block lg:hidden">
              <TokenIcon />
            </span>
            <div className="whitespace-nowrap flex flex-col lg:flex-row lg:items-center lg:gap-1">
              <div className="flex items-center gap-1">
                <span className="hidden lg:block">
                  <TokenIcon />
                </span>
                <span className="text-lg font-medium">{asset?.symbol}</span>
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
            <ChevronDownIcon className="ml-2 lg:ml-0" width={20} height={20} />
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
