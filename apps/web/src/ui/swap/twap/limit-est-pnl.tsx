import { Explainer, classNames } from '@sushiswap/ui'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

export const LimitEstPnl = () => {
  //@DEV only using priceDiff as place holder for now to present UI
  const {
    state: { percentDiff },
  } = useDerivedStateTwap()
  const priceDiff = (percentDiff || 0) / 2

  return (
    <div className="flex items-center gap-3 whitespace-nowrap font-medium">
      <div className="flex items-center gap-1">
        <span className="text-slate-900 dark:text-pink-100">Est. PnL</span>
        <Explainer>
          Profit or loss calculated as the difference in USD value of the asset
          on the day it was bought and the day it was sold.
        </Explainer>
      </div>
      <div
        className={classNames(
          priceDiff > 0
            ? 'text-green'
            : priceDiff < 0
              ? 'text-red'
              : 'text-slate-900 dark:text-pink-100',
        )}
      >
        {priceDiff === 0
          ? '-'
          : `${priceDiff > 0 ? '+' : ''} ${priceDiff.toFixed(2)}%`}
      </div>
    </div>
  )
}
