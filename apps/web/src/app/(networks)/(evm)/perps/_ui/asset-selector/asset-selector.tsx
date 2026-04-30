'use client'
import { useBreakpoint } from '@sushiswap/hooks'
import {
  Button,
  Chip,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  SkeletonBox,
} from '@sushiswap/ui'
import { DownTriangleIcon } from '@sushiswap/ui/icons/DownTriangleIcon'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/UnknownTokenIcon'
import { useEffect, useMemo, useState } from 'react'
import { getHyperliquidCoinIconUrl } from 'src/lib/perps'
// import { ShortcutMenu } from './shortcut-menu'
import { AssetIcon } from '../_common'
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
  const { isLg } = useBreakpoint('lg')

  useEffect(() => {
    if (!asset) return
    const toggleSelector = (event: KeyboardEvent) => {
      //command + k or ctrl + k
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setOpen(!open)
      }
    }

    window.addEventListener('keydown', toggleSelector)
    return () => {
      window.removeEventListener('keydown', toggleSelector)
    }
  }, [open, setOpen, asset])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="focus:!ring-0">
        {!asset ? (
          <TriggerSkeleton />
        ) : (
          <Button
            aria-label="Asset Selector"
            variant="perps-secondary"
            size="sm"
            className="whitespace-nowrap hover:!bg-transparent items-center"
          >
            <div className="whitespace-nowrap flex items-center gap-2">
              <div className="flex items-center gap-1">
                <AssetIcon asset={asset} />

                <span className="text-lg font-medium">{asset?.symbol}</span>
              </div>
              <div className="flex items-center gap-1">
                <Chip
                  variant="perps-blue"
                  className="!px-1 !py-0 rounded-md ml-1"
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
            <DownTriangleIcon width={6} height={6} />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={isLg ? 8 : -145}
        collisionPadding={isLg ? 8 : 0}
        className="flex flex-col !p-0 lg:!rounded-xl  !max-w-[100vw] !bg-perps-background/90 border !border-white/[0.07]"
      >
        <SearchBar />
        <AssetTabs />
        {/* todo: ShortcutMenu */}
        {/* <ShortcutMenu /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const TriggerSkeleton = () => {
  return (
    <Button
      variant="secondary"
      className="whitespace-nowrap lg:!rounded-xl !gap-1"
      size="sm"
      disabled
    >
      <div className="whitespace-nowrap flex items-center gap-1">
        <div className="flex items-center gap-1">
          <SkeletonBox className="w-6 h-6 min-w-[24px] !rounded-xl" />
          <SkeletonBox className="w-24 h-6" />
        </div>
        <div className="flex items-center gap-1">
          <SkeletonBox className="w-8 h-4 !rounded-[4px]" />
        </div>
      </div>
      <DownTriangleIcon width={6} height={6} />
    </Button>
  )
}
