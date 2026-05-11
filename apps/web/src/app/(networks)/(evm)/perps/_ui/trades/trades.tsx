import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { LinkExternal, SkeletonBox, classNames } from '@sushiswap/ui'
import {
  getHyperliquidExplorerUrl,
  getTextColorClass,
  perpsNumberFormatter,
  useAssetName,
  useTrades,
} from 'src/lib/perps'
import { useAssetState } from '../trade-widget'

export const Trades = () => {
  const {
    state: { activeAsset },
  } = useAssetState()
  const { data, isLoading, error } = useTrades({ assetString: activeAsset })
  const { data: assetName } = useAssetName({ assetString: activeAsset })

  return (
    <div className="max-h-[396px] px-0 lg:px-0 lg:max-h-[672px] relative overflow-y-auto hide-scrollbar">
      <div className="w-full">
        <div className="sticky top-0 dark:bg-transparent backdrop-blur-xl text-muted-foreground">
          <div className="grid grid-cols-3">
            <div className="text-left font-normal p-0.5 text-xs">Price</div>
            <div className="font-normal p-0.5 text-xs text-right">
              Size {assetName ? `(${assetName})` : ''}
            </div>
            <div className="font-normal p-0.5 text-xs text-right">Time</div>
          </div>
        </div>
        <div>
          {isLoading ? (
            Array.from({ length: 50 }).map((_, index) => (
              <SkeletonTradeRow key={index} />
            ))
          ) : error ? (
            <div className="grid grid-cols-3">
              <div className="p-2 h-20 text-xs italic text-red-500/70 text-center col-span-3">
                Error loading trades. {error?.message}
              </div>
            </div>
          ) : data && data.length > 0 ? (
            data.map((trade, index) => (
              <div key={index} className="font-medium grid grid-cols-3">
                <div
                  className={classNames(
                    'px-0.5 py-1 text-xs text-left',
                    getTextColorClass(trade.side === 'B' ? 1 : -1),
                  )}
                >
                  {perpsNumberFormatter({
                    value: trade.px,
                    maxFraxDigits: 8,
                    minFraxDigits: 0,
                  })}
                </div>
                <div className="px-0.5 py-1 text-xs text-right">
                  {perpsNumberFormatter({
                    value: trade.sz,
                    maxFraxDigits: 8,
                    minFraxDigits: 0,
                  })}
                </div>
                <div className="px-0.5 py-1 text-xs text-right">
                  {new Date(trade.time).toLocaleTimeString()}
                  <LinkExternal
                    href={getHyperliquidExplorerUrl('txn', trade.hash)}
                  >
                    <ExternalLinkIcon className="h-3.5 w-3.5 text-blue ml-1" />
                  </LinkExternal>
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-3">
              <div className="p-2 text-center col-span-3">
                No trades available.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SkeletonTradeRow = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="px-0.5 py-1">
        <SkeletonBox className="w-16 h-4" />
      </div>
      <div className="px-0.5 py-1 ">
        <SkeletonBox className="ml-auto w-16 h-4" />
      </div>
      <div className="px-0.5 py-1">
        <SkeletonBox className="w-16 ml-auto h-4" />
      </div>
    </div>
  )
}
