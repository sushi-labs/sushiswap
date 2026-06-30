'use client'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import {
  Chip,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { useCallback } from 'react'
import {
  type PerpOrSpotAsset,
  getSizeAndPercentageFromInput,
} from 'src/lib/perps'
import { AssetIcon, SizeInput } from '../../_common'
import {
  type BasisTradeSizeKey,
  type BasisTradeSizeSide,
  useAssetState,
} from '../asset-state-provider'

export const BasisTradeOrderForm = () => {
  const {
    state: { basisTradeAsset, basisTradeSize, basisTradeSizeSide, tradeSide },
    mutate: { setBasisTradeSize, setBasisTradeSizeSide },
  } = useAssetState()

  if (!basisTradeAsset) {
    return (
      <div className="text-xs text-perps-muted-50">
        Select a basis trade asset to configure both legs.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <BasisTradeInfo />
      <div className="flex items-center justify-between text-xs text-perps-muted-50">
        <span>Order</span>
        <span className="text-perps-muted-70">Market</span>
      </div>
      <BasisTradeLeg
        leg="spot"
        asset={basisTradeAsset.spotAsset}
        action={tradeSide === 'long' ? 'Buy Spot' : 'Sell Spot'}
        actionType={tradeSide === 'long' ? 'long' : 'short'}
        size={basisTradeSize.spot}
        sizeSide={basisTradeSizeSide.spot}
        onSizeChange={setBasisTradeSize}
        onSizeSideChange={setBasisTradeSizeSide}
      />
      <BasisTradeLeg
        leg="perp"
        asset={basisTradeAsset.perpAsset}
        action={tradeSide === 'long' ? 'Short Perp' : 'Long Perp'}
        actionType={tradeSide === 'long' ? 'short' : 'long'}
        size={basisTradeSize.perp}
        sizeSide={basisTradeSizeSide.perp}
        onSizeChange={setBasisTradeSize}
        onSizeSideChange={setBasisTradeSizeSide}
      />
    </div>
  )
}

const BasisTradeInfo = () => {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild tabIndex={0}>
        <button
          type="button"
          className="flex items-center gap-1 text-left text-xs text-perps-muted-50 underline decoration-dotted"
        >
          <InformationCircleIcon width={14} height={14} />
          What is a basis trade?
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        forceMount
        side="bottom"
        className="!px-3 !bg-black/10 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>
          A basis trade pairs a spot trade with the opposite perp trade on the
          same asset, aiming to capture the spread or funding difference while
          reducing directional exposure.
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}

const BasisTradeLeg = ({
  leg,
  asset,
  action,
  actionType,
  size,
  sizeSide,
  onSizeChange,
  onSizeSideChange,
}: {
  leg: BasisTradeSizeKey
  asset: PerpOrSpotAsset
  action: string
  actionType: 'long' | 'short'
  size: { base: string; quote: string }
  sizeSide: BasisTradeSizeSide[BasisTradeSizeKey]
  onSizeChange: (
    leg: BasisTradeSizeKey,
    size: { base: string; quote: string },
  ) => void
  onSizeSideChange: (
    leg: BasisTradeSizeKey,
    sizeSide: BasisTradeSizeSide[BasisTradeSizeKey],
  ) => void
}) => {
  const handleSetSize = useCallback(
    (value: string) => {
      const price = asset.markPrice || asset.midPrice || asset.lastPrice || '0'

      try {
        const { baseSize, quoteSize } = getSizeAndPercentageFromInput({
          inputValue: value,
          sizeSide,
          maxSize: '0',
          priceUsd: price,
          decimals: asset.formatParseDecimals,
        })

        onSizeChange(leg, {
          base: sizeSide === 'base' ? value : baseSize,
          quote: sizeSide === 'quote' ? value : quoteSize,
        })
      } catch (error) {
        console.error('Error formatting basis trade size:', error)
        onSizeChange(leg, {
          base: sizeSide === 'base' ? value : '0',
          quote: sizeSide === 'quote' ? value : '0',
        })
      }
    },
    [asset, leg, onSizeChange, sizeSide],
  )

  const handleSetSizeSide = useCallback(
    (_sizeSide: BasisTradeSizeSide[BasisTradeSizeKey]) => {
      onSizeSideChange(leg, _sizeSide)
    },
    [leg, onSizeSideChange],
  )

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-perps-muted-70">
          <AssetIcon asset={asset} size="sm" />
          <span>{asset.symbol}</span>
          <Chip variant="perps-blue" className="!px-1 !font-medium">
            {asset.marketType === 'perp'
              ? `${asset.maxLeverage ?? 1}x`
              : 'SPOT'}
          </Chip>
          {asset.dex ? (
            <Chip variant="perps-blue" className="!px-1 !py-0 rounded-md">
              {asset.dex}
            </Chip>
          ) : null}
        </div>
        <span
          className={classNames(
            actionType === 'long' ? 'text-perps-green' : 'text-perps-red',
          )}
        >
          {action}
        </span>
      </div>
      <SizeInput
        asset={asset}
        sizeSide={sizeSide}
        setSizeSide={handleSetSizeSide}
        value={size}
        onChange={handleSetSize}
        className="!py-0 text-sm !px-2"
      />
    </div>
  )
}
