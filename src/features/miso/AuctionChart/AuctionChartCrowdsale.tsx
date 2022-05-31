import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Auction } from 'app/features/miso/context/Auction'
import { classNames } from 'app/functions'
import useInterval from 'app/hooks/useInterval'
import useTextWidth from 'app/hooks/useTextWidth'
import { FC, useState } from 'react'
// @ts-ignore TYPE NEEDS FIXING
import AutoSizer from 'react-virtualized-auto-sizer'

import { PriceIndicator } from './PriceIndicator'

interface AuctionChartCrowdsaleProps {
  auction: Auction
  prices: boolean
  showPriceIndicator: boolean
}

const AuctionChartCrowdsale: FC<AuctionChartCrowdsaleProps> = ({ auction, prices, showPriceIndicator }) => {
  const { i18n } = useLingui()
  const priceInfoWidth = useTextWidth({
    text: `Current Token Value`,
    font: '14px DM Sans',
  })
  const startTime = auction.auctionInfo.startTime.mul('1000').toNumber()
  const endTime = auction.auctionInfo.endTime.mul('1000').toNumber()
  const now = Date.now()
  const [progression, setState] = useState<number>(Math.min(1, Math.max((now - startTime) / (endTime - startTime), 0)))

  useInterval(() => {
    setState(Math.min(1, Math.max((now - startTime) / (endTime - startTime), 0)))
  }, 1000)

  const bottomHeight = 60
  const paddingX = 20
  const paddingY = 50
  const topPadding = 20
  const minHeight = prices ? 'min-h-[234px]' : 'min-h-[94px]'

  return (
    <div className={classNames('relative w-full h-full', minHeight)}>
      <AutoSizer>
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        {({ width, height }) => {
          const remainingHeight = prices ? height - bottomHeight : height
          const currentX = paddingX + (width - 2 * paddingX) * progression
          const currentY = remainingHeight / 2
          const orientation = currentX + priceInfoWidth + 15 < width ? 'top' : 'bottom'

          return (
            <div className="relative">
              <svg
                className="text-green"
                width={width}
                height={remainingHeight}
                viewBox={`0 0 ${width} ${remainingHeight}`}
              >
                <circle r="4" cx={paddingX} cy={remainingHeight / 2} fill="currentColor" />
                <line
                  x1={paddingX}
                  y1={currentY}
                  x2={width - paddingX}
                  y2={currentY}
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity={0.2}
                />
                <line x1={paddingX} y1={currentY} x2={currentX} y2={currentY} stroke="currentColor" strokeWidth="2" />
                <circle r="4" cx={width - paddingX} cy={currentY} fill="currentColor" />
                {showPriceIndicator && (
                  <PriceIndicator x={currentX} y={currentY} auction={auction} orientation={orientation} />
                )}
              </svg>
              {prices && (
                <svg
                  className="text-green"
                  width={width}
                  height={bottomHeight}
                  viewBox={`0 0 ${width} ${bottomHeight}`}
                >
                  <text x={topPadding} y={bottomHeight - 46} fill="#7f7f7f" fontSize="14px">
                    {i18n._(t`Price`)}
                  </text>
                  <text x={topPadding} y={bottomHeight - topPadding} fill="#FFFFFF" fontSize="18px" fontWeight={700}>
                    {auction?.startPrice?.toSignificant(6)} {auction?.startPrice?.quoteCurrency.symbol}
                  </text>
                </svg>
              )}
            </div>
          )
        }}
      </AutoSizer>
    </div>
  )
}

export default AuctionChartCrowdsale
