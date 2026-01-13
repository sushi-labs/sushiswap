import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkExternal,
  classNames,
} from '@sushiswap/ui'
import { useActiveAsset } from 'src/lib/perps/use-active-asset'
import { useInitialDecimals } from 'src/lib/perps/use-initial-decimals'
import {
  enUSFormatNumber,
  getHyperliquidExplorerUrl,
  getSignForValue,
  getTextColorClass,
} from 'src/lib/perps/utils'
import { formatNumber, formatPercent, truncateString } from 'sushi'
import { useAssetListState } from '../asset-list-provider'
import { usePerpState } from '../perp-state-provider'
import { ValueSensitiveText } from '../value-sensitive-text'

export const SpotTokenStats = () => {
  const {
    state: {
      assetListQuery: { data },
    },
  } = useAssetListState()
  const {
    state: { activeAsset },
  } = usePerpState()
  const token = data?.get?.(activeAsset)
  const { data: tokenData } = useActiveAsset({
    assetString: activeAsset,
  })
  const initialDecimals = useInitialDecimals(tokenData?.markPrice)

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
          value={
            tokenData?.midPrice?.toString() ??
            tokenData?.markPrice?.toString() ??
            ''
          }
          className="text-sm font-medium tabular-nums lining-nums min-w-[var(--w)] inline-block"
          formatOptions={{
            minimumFractionDigits: initialDecimals,
            maximumFractionDigits: initialDecimals,
          }}
        />
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Change</div>

        <p
          className={classNames(
            'text-sm whitespace-nowrap tabular-nums font-medium',
            tokenData?.change24hAbs &&
              getTextColorClass(Number(tokenData.change24hAbs)),
          )}
        >
          {getSignForValue(Number(tokenData?.change24hAbs ?? 0))}
          {formatNumber(Number(tokenData?.change24hAbs ?? 0).toFixed(2))} /{' '}
          {getSignForValue(Number(tokenData?.change24hPct ?? 0))}
          {formatPercent(tokenData?.change24hPct)}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Volume</div>

        <p className={classNames('text-sm  font-medium tabular-nums')}>
          {enUSFormatNumber.format(Number(tokenData?.volume24hUsd ?? 0))}{' '}
          {token?.tokens?.[1]?.name}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">Market Cap</div>

        <p className={classNames('text-sm  font-medium tabular-nums')}>
          {enUSFormatNumber.format(Number(tokenData?.marketCap ?? 0))}{' '}
          {token?.tokens?.[1]?.name}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">Contract</div>

        <LinkExternal
          className={classNames('font-medium')}
          href={
            token?.tokens?.[0]?.tokenId
              ? `${getHyperliquidExplorerUrl('token', token?.tokens?.[0]?.tokenId)}`
              : ''
          }
        >
          <div className="!text-sm flex ">
            <span>
              {truncateString(token?.tokens?.[0]?.tokenId ?? '', 10, 'middle')}
              <ExternalLinkIcon className="w-4 h-4 ml-1 inline-block" />
            </span>
          </div>
        </LinkExternal>
      </div>
    </>
  )
}
