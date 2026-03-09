import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { formatPrice } from '@nktkas/hyperliquid/utils'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkExternal,
  classNames,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  getHyperliquidExplorerUrl,
  getSignForValue,
  getTextColorClass,
  perpsNumberFormatter,
  useActiveAsset,
} from 'src/lib/perps'
import { formatPercent, truncateString } from 'sushi'
import { ValueSensitiveText } from '../_common'
import { useAssetListState } from '../asset-selector'
import { useAssetState } from '../trade-widget/asset-state-provider'
import { AssetStatsSkeleton } from './asset-stats-skeleton'

export const SpotAssetStats = () => {
  const {
    state: {
      assetListQuery: { data, isLoading },
    },
  } = useAssetListState()
  const {
    state: { activeAsset },
  } = useAssetState()
  const asset = useMemo(() => data?.get?.(activeAsset), [data, activeAsset])
  const { data: assetData, isLoading: isAssetLoading } = useActiveAsset({
    assetString: activeAsset,
  })

  if (isLoading || isAssetLoading || !assetData || !asset) {
    return Array(8)
      .fill(0)
      .map((_, i) => <AssetStatsSkeleton key={i} />)
  }

  return (
    <>
      <div className="flex flex-col">
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild tabIndex={0}>
            <div className="text-sm text-muted-foreground underline cursor-pointer">
              Price
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            forceMount
            side="top"
            className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
          >
            <p>Mid price if it exists, otherwise the mark price.</p>
          </HoverCardContent>
        </HoverCard>

        <ValueSensitiveText
          value={formatPrice(
            assetData?.lastPrice?.toString() ?? '',
            asset?.decimals ?? 0,
            'spot',
          )}
          className="text-sm font-medium tabular-nums lining-nums min-w-[var(--w)] inline-block"
          formatOptions={{
            minimumFractionDigits: 0,
            maximumFractionDigits: asset?.decimals,
          }}
        />
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Change</div>

        <p
          className={classNames(
            'text-sm whitespace-nowrap tabular-nums font-medium',
            assetData?.change24hAbs &&
              getTextColorClass(Number(assetData.change24hAbs)),
          )}
        >
          {getSignForValue(Number(assetData?.change24hAbs ?? 0))}
          {perpsNumberFormatter({
            value: assetData?.change24hAbs ?? '0',
            maxFraxDigits: 4,
          })}{' '}
          / {getSignForValue(Number(assetData?.change24hPct ?? 0))}
          {formatPercent(assetData?.change24hPct)}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Volume</div>

        <p className={classNames('text-sm  font-medium tabular-nums')}>
          {perpsNumberFormatter({
            value: assetData?.volume24hUsd ?? 0,
            maxFraxDigits: 2,
            minFraxDigits: 2,
          })}{' '}
          {asset?.tokens?.[1]?.name}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">Market Cap</div>

        <p className={classNames('text-sm  font-medium tabular-nums')}>
          {perpsNumberFormatter({
            value: assetData?.marketCap ?? 0,
            maxFraxDigits: 2,
            minFraxDigits: 2,
          })}{' '}
          {asset?.tokens?.[1]?.name}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">Contract</div>

        <LinkExternal
          className={classNames('font-medium')}
          href={
            asset?.tokens?.[0]?.tokenId
              ? `${getHyperliquidExplorerUrl('token', asset?.tokens?.[0]?.tokenId)}`
              : ''
          }
        >
          <div className="!text-sm flex ">
            <span>
              {truncateString(asset?.tokens?.[0]?.tokenId ?? '', 10, 'middle')}
              <ExternalLinkIcon className="w-4 h-4 ml-1 inline-block" />
            </span>
          </div>
        </LinkExternal>
      </div>
    </>
  )
}
