import { CurrencyLogo } from 'app/components/CurrencyLogo'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { FC } from 'react'

const ClassicTokenPrices: FC = () => {
  const { poolWithState } = usePoolContext()

  return (
    <div className="grid-cols-1 gap-2 space-y-2 lg:grid lg:grid-cols-2 lg:space-y-0">
      <ListPanel
        items={[
          <div key={0} className="flex items-center w-full px-3 py-2 space-x-2 bg-dark-900">
            <CurrencyLogo currency={poolWithState?.pool?.token0} size={20} />
            <Typography variant="sm" weight={700}>
              1 {poolWithState?.pool?.token0.symbol} ={' '}
              {poolWithState?.pool?.reserve1?.greaterThan(0) ? poolWithState?.pool?.token0Price.toSignificant(6) : 0}{' '}
              {poolWithState?.pool?.token1.symbol}
            </Typography>
          </div>,
        ]}
        className="w-full"
      />
      <ListPanel
        items={[
          <div key={0} className="flex items-center w-full px-3 py-2 space-x-2 bg-dark-900">
            <CurrencyLogo currency={poolWithState?.pool?.token1} size={20} />
            <Typography variant="sm" weight={700}>
              1 {poolWithState?.pool?.token1.symbol} ={' '}
              {poolWithState?.pool?.reserve0?.greaterThan(0) ? poolWithState?.pool?.token1Price.toSignificant(6) : 0}{' '}
              {poolWithState?.pool?.token0.symbol}
            </Typography>
          </div>,
        ]}
        className="w-full"
      />
    </div>
  )
}

export default ClassicTokenPrices
