import { ArrowRightIcon } from '@heroicons/react/outline'
import { formatUSD } from '@sushiswap/format'
import { classNames, Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC, ReactNode, useState } from 'react'

import { KashiPair } from '../../.graphclient'
import { useLiquidationPrice, useTokensFromKashiPair } from '../../lib/hooks'
import { useBorrowContext } from '../BorrowProvider'

interface YourPositionBlock {
  label: ReactNode
  value: ReactNode
  newValue?: ReactNode
  caption: ReactNode
  newCaption?: ReactNode
}

const YourPositionBlock: FC<YourPositionBlock> = ({ label, value, newValue, caption, newCaption }) => {
  return (
    <div className="flex flex-col rounded-lg bg-slate-800 p-3">
      <Typography variant="sm" weight={400} className="text-slate-300">
        {label}
      </Typography>
      <Typography
        variant="lg"
        weight={600}
        className={classNames(newValue ? 'text-slate-500' : 'text-slate-100', 'flex gap-1 items-center mt-2')}
      >
        {value}
        {newValue && (
          <>
            <ArrowRightIcon width={12} height={12} className="text-slate-500" />
            <Typography variant="lg" weight={600} className="text-green" as="span">
              {newValue}
            </Typography>
          </>
        )}
      </Typography>
      <Typography
        variant="sm"
        weight={400}
        className={classNames(newCaption ? 'text-slate-500' : 'text-slate-400', 'flex gap-1 items-center')}
      >
        {caption}
        {newCaption && (
          <>
            <ArrowRightIcon width={12} height={12} className="text-slate-500" />
            <Typography variant="sm" weight={400} className="text-green" as="span">
              {newCaption}
            </Typography>
          </>
        )}
      </Typography>
    </div>
  )
}

interface YourPosition {
  pair: KashiPair
}

export const YourPosition: FC<YourPosition> = ({ pair }) => {
  const [invert, setInvert] = useState(false)
  const { asset, collateral } = useTokensFromKashiPair(pair)
  const { collateralValue, collateralAsEntity, borrowValue, borrowAsEntity } = useBorrowContext()
  const { data: prices } = usePrices({ chainId: pair.chainId })

  // TODO
  const liquidationPrice = useLiquidationPrice({
    pair,
    collateralAmount: collateralAsEntity,
    borrowAmount: borrowAsEntity,
    invert,
    reduce: false,
    trade: undefined,
  })

  return (
    <div className="flex flex-col gap-3">
      <Typography weight={600} className="text-slate-200">
        Your Position
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <YourPositionBlock
          label="Collateral"
          value="$0.0"
          newValue={
            collateralAsEntity && prices?.[collateral.wrapped.address]
              ? formatUSD(collateralAsEntity?.multiply(prices?.[collateral.wrapped.address].asFraction).toFixed(2))
              : undefined
          }
          caption={`0.00 ${pair.collateral.symbol}`}
          {...(collateralValue && { newCaption: `${collateralValue} ${pair.collateral.symbol}` })}
        />
        <YourPositionBlock
          label="Borrowed"
          value="$0.0"
          newValue={
            borrowAsEntity && prices?.[asset.wrapped.address]
              ? formatUSD(borrowAsEntity?.multiply(prices?.[asset.wrapped.address].asFraction).toFixed(2))
              : undefined
          }
          caption={`0.00 ${pair.asset.symbol}`}
          {...(borrowValue && { newCaption: `${borrowValue} ${pair.asset.symbol}` })}
        />
        <div onClick={() => setInvert((prev) => !prev)} className="cursor-pointer">
          <YourPositionBlock label="Liquidation Price" value={liquidationPrice} caption="n/a" />
        </div>
        <YourPositionBlock
          label="Health"
          value={
            <>
              0% <div className="rounded-full bg-green w-2 h-2" />
            </>
          }
          caption="Good"
        />
      </div>
    </div>
  )
}
