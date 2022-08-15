import { ArrowRightIcon } from '@heroicons/react/outline'
import { classNames, Typography } from '@sushiswap/ui'
import { FC, ReactNode } from 'react'

import { KashiPair } from '../../.graphclient'

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
            <Typography variant="lg" weight={600} className="text-slate-100" as="span">
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
            <Typography variant="sm" weight={400} className="text-slate-400" as="span">
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
  return (
    <div className="flex flex-col gap-3">
      <Typography weight={600} className="text-slate-200">
        Your Position
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <YourPositionBlock
          label="Collateral"
          value="$0.0"
          newValue="$11.0"
          caption={`0.00 ${pair.collateral.symbol}`}
          newCaption={`11.0 ${pair.collateral.symbol}`}
        />
        <YourPositionBlock label="Borrowed" value="$0.0" caption={`0.00 ${pair.asset.symbol}`} />
        <YourPositionBlock label="Liquidation Price" value="None" caption="n/a" />
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
