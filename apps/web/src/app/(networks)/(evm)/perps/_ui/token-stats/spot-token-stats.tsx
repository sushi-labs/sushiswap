import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkExternal,
  classNames,
} from '@sushiswap/ui'
import { useAssetList } from 'src/lib/perps/use-asset-list'
import {
  enUSFormatNumber,
  getHyperliquidExplorerUrl,
  getSignForValue,
  getTextColorClass,
} from 'src/lib/perps/utils'
import { formatNumber, formatPercent, truncateString } from 'sushi'
import { ValueSensitiveText } from '../value-sensitive-text'

export const SpotTokenStats = () => {
  const { data } = useAssetList()
  //todo: provider for selected token
  const token = data?.spot?.get?.('HYPE/USDC')
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
            token?.midPrice?.toString() ?? token?.markPrice?.toString() ?? ''
          }
          className="text-sm font-medium tabular-nums"
        />
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Change</div>

        <p
          className={classNames(
            'text-sm whitespace-nowrap tabular-nums',
            token?.change24hAbs &&
              getTextColorClass(Number(token.change24hAbs)),
          )}
        >
          {getSignForValue(Number(token?.change24hAbs ?? 0))}
          {formatNumber(token?.change24hAbs ?? 0)} /{' '}
          {getSignForValue(Number(token?.change24hPct ?? 0))}
          {formatPercent(token?.change24hPct)}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">24H Volume</div>

        <p className={classNames('text-sm  font-medium tabular-nums')}>
          {enUSFormatNumber.format(Number(token?.volume24hUsd ?? 0))}{' '}
          {token?.tokens?.[1]?.name}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">Market Cap</div>

        <p className={classNames('text-sm  font-medium tabular-nums')}>
          {enUSFormatNumber.format(Number(token?.marketCap ?? 0))}{' '}
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
