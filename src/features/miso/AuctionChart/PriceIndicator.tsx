import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import QuestionHelper from 'app/components/QuestionHelper'
import { Auction } from 'app/features/miso/context/Auction'
import useTextWidth from 'app/hooks/useTextWidth'
import { FC } from 'react'

import { AuctionPriceHelperTextByTemplateId } from '../context/utils'

export const PriceIndicator: FC<{
  orientation: 'top' | 'bottom'
  x: number
  y: number
  auction: Auction
}> = ({ orientation, x, y, auction }) => {
  const { i18n } = useLingui()
  const symbol = auction?.minimumPrice ? auction?.minimumPrice?.quoteCurrency?.symbol : auction?.paymentToken?.symbol

  const priceInfoWidth = useTextWidth({
    text: `Current Token Value`,
    font: '14px DM Sans',
  })
  const currentPriceWidth = useTextWidth({
    text: `${auction?.currentPrice?.toSignificant(6)} ${symbol}`,
    font: '16px DM Sans',
  })

  const priceLineLength = 50
  const priceLineXOffset = 1
  const infoTextTopPositionX = x + 10
  const infoTextTopPositionY = y - 35
  const tooltipTopPositionX = x + 145
  const tooltipTopPositionY = y - 45
  const priceTextTopPositionX = x + 10
  const priceTextTopPositionY = y - 10
  const infoTextBottomPositionX = x - (priceInfoWidth + 20)
  const infoTextBottomPositionY = y + 20
  const tooltipBottomPositionX = x - 17.5
  const tooltipBottomPositionY = y + 10
  const priceTextBottomPositionX = x - (currentPriceWidth + 10)
  const priceTextBottomPositionY = y + 45

  return (
    <>
      <line
        x1={x + priceLineXOffset}
        x2={x + priceLineXOffset}
        y1={orientation === 'bottom' ? y + priceLineLength : y}
        y2={orientation === 'bottom' ? y : y - priceLineLength}
        stroke="currentColor"
        strokeWidth="2"
        opacity={0.2}
      />
      <text
        x={orientation === 'bottom' ? infoTextBottomPositionX : infoTextTopPositionX}
        y={orientation === 'bottom' ? infoTextBottomPositionY : infoTextTopPositionY}
        fill="#7f7f7f"
        fontSize="14px"
      >
        {i18n._(t`Current Token Value`)}
      </text>
      <foreignObject
        width="10"
        height="30"
        x={orientation === 'bottom' ? tooltipBottomPositionX : tooltipTopPositionX}
        y={orientation === 'bottom' ? tooltipBottomPositionY : tooltipTopPositionY}
      >
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <QuestionHelper text={AuctionPriceHelperTextByTemplateId(i18n)[auction.template]}>
          <span>
            <QuestionMarkCircleIcon width={12} height={12} className="ml-0 text-secondary mb-[4px] text-dark-400" />
          </span>
        </QuestionHelper>
      </foreignObject>
      <text
        x={orientation === 'bottom' ? priceTextBottomPositionX : priceTextTopPositionX}
        y={orientation === 'bottom' ? priceTextBottomPositionY : priceTextTopPositionY}
        fill="#ffffff"
      >
        {auction?.currentPrice?.toSignificant(6)} {symbol}
      </text>
    </>
  )
}
