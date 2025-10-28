import { Explainer, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { formatUSD } from 'sushi'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

export const LimitEstPnl = () => {
  const {
    state: {
      amountInPerChunk,
      amountOut,
      chunks,
      token0PriceUSD,
      token1PriceUSD,
    },
  } = useDerivedStateTwap()

  const pnl = useMemo(() => {
    if (!amountInPerChunk || !amountOut || !token0PriceUSD || !token1PriceUSD) {
      return 0
    }
    const totalInUSD = amountInPerChunk
      ?.mulHuman(token0PriceUSD.toString({ fixed: 6 }))
      ?.mul(BigInt(chunks) || 1n)
      .toString()
    const totalOutUSD = amountOut
      ?.mulHuman(token1PriceUSD.toString({ fixed: 6 }))
      .toString()
    const _pnl = Number.parseFloat(totalOutUSD) - Number.parseFloat(totalInUSD)
    return _pnl
  }, [amountInPerChunk, amountOut, token0PriceUSD, token1PriceUSD, chunks])

  return (
    <div className="flex items-center gap-3 font-medium whitespace-nowrap">
      <div className="flex items-center gap-1">
        <span className="text-slate-900 dark:text-pink-100">Est. PnL</span>
        <Explainer
          iconProps={{
            className: 'text-slate-450 dark:text-slate-500',
          }}
        >
          <p className="dark:bg-black/10 bg-white/10 !text-slate-900 dark:!text-pink-100 text-xs">
            Profit or loss calculated as the difference in USD value of the
            asset on the day it was bought and the day it was sold.
          </p>
        </Explainer>
      </div>
      <div
        className={classNames(
          pnl > 0
            ? 'text-[#1DA67D]'
            : pnl < 0
              ? 'text-red'
              : 'text-slate-900 dark:text-pink-100',
        )}
      >
        {pnl === 0 ? '-' : `${pnl > 0 ? '+' : ''}${formatUSD(pnl)}`}
      </div>
    </div>
  )
}
