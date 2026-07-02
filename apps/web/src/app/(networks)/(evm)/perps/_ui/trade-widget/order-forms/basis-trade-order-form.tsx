'use client'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import {
  Chip,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { useCallback, useMemo, useState } from 'react'
import {
  type PerpOrSpotAsset,
  getSizeAndPercentageFromInput,
  getSizeAndPercentageFromPercentageInput,
} from 'src/lib/perps'
import { AssetIcon, PercentageSlider, SizeInput } from '../../_common'
import {
  type BasisTradeSizeKey,
  type BasisTradeSizeSide,
  useAssetState,
} from '../asset-state-provider'
import { useBasisTradeAccountBalances } from '../basis-trade-spot-availability'

type BasisTradePercentage = Record<BasisTradeSizeKey, number>

export const BasisTradeOrderForm = () => {
  const {
    state: {
      basisTradeAsset,
      basisTradeSize,
      basisTradeSizeSide,
      maxTradeSizeLong,
      maxTradeSizeShort,
      tradeSide,
    },
    mutate: { setBasisTradeSize, setBasisTradeSizeSide },
  } = useAssetState()
  const { spotBaseBalance, spotQuoteBalance } = useBasisTradeAccountBalances({
    basisTradeAsset,
  })
  const [basisTradePercentage, setBasisTradePercentage] =
    useState<BasisTradePercentage>({
      spot: 0,
      perp: 0,
    })

  const spotMaxSize = useMemo(() => {
    if (!basisTradeAsset) return '0'

    if (tradeSide === 'short') {
      return spotBaseBalance?.availableBalance ?? '0'
    }

    const price =
      basisTradeAsset.spotAsset.markPrice ||
      basisTradeAsset.spotAsset.midPrice ||
      basisTradeAsset.spotAsset.lastPrice ||
      '0'
    const quoteBalance = Number(spotQuoteBalance?.availableBalance ?? 0)
    const spotPrice = Number(price)

    if (
      !Number.isFinite(quoteBalance) ||
      !Number.isFinite(spotPrice) ||
      spotPrice <= 0
    ) {
      return '0'
    }

    return (quoteBalance / spotPrice).toString()
  }, [
    basisTradeAsset,
    spotBaseBalance?.availableBalance,
    spotQuoteBalance?.availableBalance,
    tradeSide,
  ])

  const perpMaxSize =
    tradeSide === 'long' ? maxTradeSizeShort : maxTradeSizeLong

  const handlePercentageChange = useCallback(
    (leg: BasisTradeSizeKey, percentage: number) => {
      setBasisTradePercentage((prev) => ({
        ...prev,
        [leg]: percentage,
      }))
    },
    [],
  )

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
      <BasisTradeLeg
        leg="spot"
        asset={basisTradeAsset.spotAsset}
        //not a lot of spot tokens have icons, so we use the perp asset for the icon instead
        assetForIcon={basisTradeAsset.perpAsset}
        action={tradeSide === 'long' ? 'Buy Spot' : 'Sell Spot'}
        actionType={tradeSide === 'long' ? 'long' : 'short'}
        size={basisTradeSize.spot}
        sizeSide={basisTradeSizeSide.spot}
        maxSize={spotMaxSize}
        percentage={
          basisTradeSize.spot.base || basisTradeSize.spot.quote
            ? basisTradePercentage.spot
            : 0
        }
        onSizeChange={setBasisTradeSize}
        onSizeSideChange={setBasisTradeSizeSide}
        onPercentageChange={handlePercentageChange}
      />
      <BasisTradeLeg
        leg="perp"
        asset={basisTradeAsset.perpAsset}
        action={tradeSide === 'long' ? 'Short Perp' : 'Long Perp'}
        actionType={tradeSide === 'long' ? 'short' : 'long'}
        size={basisTradeSize.perp}
        sizeSide={basisTradeSizeSide.perp}
        maxSize={perpMaxSize}
        percentage={
          basisTradeSize.perp.base || basisTradeSize.perp.quote
            ? basisTradePercentage.perp
            : 0
        }
        onSizeChange={setBasisTradeSize}
        onSizeSideChange={setBasisTradeSizeSide}
        onPercentageChange={handlePercentageChange}
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
          reducing directional exposure. It is recommended that users enable
          Unified Account Mode in settings for a better experience.
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}

const BasisTradeLeg = ({
  leg,
  asset,
  assetForIcon,
  action,
  actionType,
  size,
  sizeSide,
  maxSize,
  percentage,
  onSizeChange,
  onSizeSideChange,
  onPercentageChange,
}: {
  leg: BasisTradeSizeKey
  asset: PerpOrSpotAsset
  assetForIcon?: PerpOrSpotAsset
  action: string
  actionType: 'long' | 'short'
  size: { base: string; quote: string }
  sizeSide: BasisTradeSizeSide[BasisTradeSizeKey]
  maxSize: string
  percentage: number
  onSizeChange: (
    leg: BasisTradeSizeKey,
    size: { base: string; quote: string },
  ) => void
  onSizeSideChange: (
    leg: BasisTradeSizeKey,
    sizeSide: BasisTradeSizeSide[BasisTradeSizeKey],
  ) => void
  onPercentageChange: (leg: BasisTradeSizeKey, percentage: number) => void
}) => {
  const handleSetSize = useCallback(
    (value: string) => {
      const price = asset.markPrice || asset.midPrice || asset.lastPrice || '0'

      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromInput({
            inputValue: value,
            sizeSide,
            maxSize,
            priceUsd: price,
            decimals: asset.formatParseDecimals,
          })
        onPercentageChange(leg, percentage)

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
    [asset, leg, maxSize, onPercentageChange, onSizeChange, sizeSide],
  )

  const handleSetPercentage = useCallback(
    (value: number) => {
      const price = asset.markPrice || asset.midPrice || asset.lastPrice || '0'

      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromPercentageInput({
            percentageInput: value,
            maxSize,
            priceUsd: price,
            decimals: asset.formatParseDecimals,
          })

        onSizeChange(leg, { base: baseSize, quote: quoteSize })
        onPercentageChange(leg, percentage)
      } catch (error) {
        console.error('Error formatting basis trade size:', error)
        onSizeChange(leg, { base: '0', quote: '0' })
        onPercentageChange(leg, value)
      }
    },
    [asset, leg, maxSize, onPercentageChange, onSizeChange],
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
          <AssetIcon asset={assetForIcon || asset} size="sm" />
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
      <PercentageSlider
        value={percentage}
        onChange={handleSetPercentage}
        variant={actionType}
      />
    </div>
  )
}
