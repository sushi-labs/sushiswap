import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { classNames, formatPercent } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useRollingPoolStats } from 'app/services/graph/hooks/pools'
import { useActiveWeb3React } from 'app/services/web3'
import { FC } from 'react'

interface PoolStatsProps {}

const PoolStats: FC<PoolStatsProps> = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const isDesktop = useDesktopMediaQuery()
  const { poolWithState } = usePoolContext()

  const { data: stats } = useRollingPoolStats({
    chainId,
    variables: { where: { id: poolWithState?.pool?.liquidityToken?.address.toLowerCase() } },
    shouldFetch: !!chainId && !!poolWithState?.pool && !!poolWithState?.pool.liquidityToken.address.toLowerCase(),
  })

  const items = [
    {
      label: i18n._(t`Volume (24H)`),
      value: 'volume',
      change: 'volume24hChange',
    },
    {
      label: i18n._(t`Fees (24H)`),
      value: 'fees',
      change: 'fees24hChange',
    },
    {
      label: i18n._(t`Utilization (24H)`),
      value: 'liquidity',
      change: 'liquidity24hChange',
    },
    {
      label: i18n._(t`Transactions (24H)`),
      value: 'transactions',
      change: 'transactions24hChange',
    },
  ]

  console.log({ stats })

  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-4">
      {items.map(({ label, value, change }, index) => (
        <div
          className="flex flex-row justify-between p-3 border rounded lg:flex-col lg:gap-1 bg-dark-900 border-dark-800 lg:bg-dark-800 lg:border-dark-700"
          key={index}
        >
          <Typography variant={isDesktop ? 'xs' : 'sm'} weight={700}>
            {label}
          </Typography>
          <div className="flex flex-row gap-2 lg:flex-col lg:gap-0">
            <Typography weight={700} variant={isDesktop ? 'lg' : 'base'} className="text-high-emphesis">
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              {stats?.[0]?.[value]}
            </Typography>
            <Typography
              weight={400}
              variant={isDesktop ? 'xs' : 'sm'}
              // @ts-ignore TYPE NEEDS FIXING
              className={classNames(
                stats?.[0]?.[change] > 0 && 'text-green',
                stats?.[0]?.[change] < 0 && 'text-red',
                'text-inherit'
              )}
            >
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              {formatPercent(stats?.[0]?.[change])}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PoolStats
