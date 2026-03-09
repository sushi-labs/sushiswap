import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { LinkExternal, SkeletonBox, classNames } from '@sushiswap/ui'
import {
  getHyperliquidExplorerUrl,
  getTextColorClass,
  numberFormatter,
  useAssetName,
  useTrades,
} from 'src/lib/perps'
import { useAssetState } from './trade-widget/asset-state-provider'

export const Trades = () => {
  const {
    state: { activeAsset },
  } = useAssetState()
  const { data, isLoading, error } = useTrades({ assetString: activeAsset })
  const { data: assetName } = useAssetName({ assetString: activeAsset })

  return (
    <div className="max-h-[400px] lg:max-h-[672px] relative overflow-y-auto hide-scrollbar">
      <table className="w-full">
        <thead className="sticky top-0 bg-white dark:bg-background text-muted-foreground">
          <tr>
            <th className="text-left font-normal p-0.5 text-xs">Price</th>
            <th className="font-normal p-0.5 text-xs text-right">
              Size {assetName ? `(${assetName})` : ''}
            </th>
            <th className="font-normal p-0.5 text-xs text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 50 }).map((_, index) => (
              <SkeletonTradeRow key={index} />
            ))
          ) : error ? (
            <tr>
              <td
                colSpan={3}
                className="p-2 h-20 text-xs italic text-red-500/70 text-center"
              >
                Error loading trades. {error?.message}
              </td>
            </tr>
          ) : data && data.length > 0 ? (
            data.map((trade, index) => (
              <tr key={index} className="font-medium">
                <td
                  className={classNames(
                    'px-0.5 py-1 text-xs text-left',
                    getTextColorClass(trade.side === 'B' ? 1 : -1),
                  )}
                >
                  {numberFormatter.format(Number.parseFloat(trade.px))}
                </td>
                <td className="px-0.5 py-1 text-xs text-right">
                  {numberFormatter.format(Number.parseFloat(trade.sz))}
                </td>
                <td className="px-0.5 py-1 text-xs text-right">
                  {new Date(trade.time).toLocaleTimeString()}
                  <LinkExternal
                    href={getHyperliquidExplorerUrl('txn', trade.hash)}
                  >
                    <ExternalLinkIcon className="h-3.5 w-3.5 text-blue ml-1" />
                  </LinkExternal>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-2 text-center">
                No trades available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const SkeletonTradeRow = () => {
  return (
    <tr>
      <td className="px-0.5 py-1">
        <SkeletonBox className="w-16 h-4" />
      </td>
      <td className="px-0.5 py-1 ">
        <SkeletonBox className="ml-auto w-16 h-4" />
      </td>
      <td className="px-0.5 py-1">
        <SkeletonBox className="w-16 ml-auto h-4" />
      </td>
    </tr>
  )
}
