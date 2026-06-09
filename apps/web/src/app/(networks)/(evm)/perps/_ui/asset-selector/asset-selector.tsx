'use client'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useBreakpoint } from '@sushiswap/hooks'
import {
  Button,
  Chip,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
  SkeletonBox,
} from '@sushiswap/ui'
import { DownTriangleIcon } from '@sushiswap/ui/icons/DownTriangleIcon'
import { useEffect, useMemo } from 'react'
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

  const content = useMemo(() => {
    return (
      <>
        <div className="px-2 lg:px-0">
          <SearchBar />
        </div>
        <AssetTabs />
      </>
    )
  }, [])

  if (!isLg) {
    return (
      <PerpsDialog open={open} onOpenChange={setOpen}>
        <PerpsDialogTrigger asChild>
          {!asset ? (
            <TriggerSkeleton />
          ) : (
            <Button
              aria-label="Asset Selector"
              variant="perps-secondary"
              size="sm"
              className="whitespace-nowrap hover:!bg-transparent items-center"
            >
              <Trigger />
            </Button>
          )}
        </PerpsDialogTrigger>
        <PerpsDialogContent
          onOpenAutoFocus={(e) => {
            e.preventDefault()
          }}
          aria-describedby={undefined}
          hideClose
          className="!p-0 min-w-[100vw] !rounded-xl focus:!ring-0"
          wrapperClassName="!rounded-xl"
        >
          <VisuallyHidden>
            <PerpsDialogTitle>Asset Selector</PerpsDialogTitle>
          </VisuallyHidden>
          <PerpsDialogInnerContent className="!p-0 !max-h-[100dvh] hide-scrollbar">
            {content}
          </PerpsDialogInnerContent>
        </PerpsDialogContent>
      </PerpsDialog>
    )
  }

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
            <Trigger />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex flex-col !p-0 lg:!rounded-xl !max-w-[100vw] !shadow-[inset_1.5px_2px_1px_-2px_rgba(255,255,255,0.2),inset_-1.5px_-1.5px_1px_-2px_rgba(255,255,255,0.125)] !bg-perps-background/90 border !border-white/[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(237, 241, 243, 0.1) 0%, rgba(237, 241, 243, 0.03) 100%)',
        }}
      >
        {content}
        {/* todo: ShortcutMenu */}
        {/* <ShortcutMenu /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Trigger = () => {
  const {
    state: { asset },
  } = useAssetState()

  return (
    <>
      <div className="whitespace-nowrap flex items-center gap-2">
        <div className="flex items-center gap-1">
          <AssetIcon asset={asset} />

          <span className="text-lg font-medium">{asset?.symbol}</span>
        </div>
        <div className="flex items-center gap-1">
          <Chip variant="perps-blue" className="!px-1 !py-0 rounded-md ml-1">
            {asset?.maxLeverage ? `${asset.maxLeverage}x` : 'Spot'}
          </Chip>
          {asset?.dex ? (
            <Chip variant="perps-blue" className="!px-1 !py-0 rounded-md ml-1">
              {asset.dex}
            </Chip>
          ) : null}
        </div>
      </div>
      <DownTriangleIcon width={6} height={6} />
    </>
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
