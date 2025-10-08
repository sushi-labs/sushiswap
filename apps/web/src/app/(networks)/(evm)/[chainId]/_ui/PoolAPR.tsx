import type { V2Pool, V3Pool } from '@sushiswap/graph-client/data-api'
import {
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  Currency,
} from '@sushiswap/ui'
import { EvmToken } from 'sushi/evm'
import { Wrapper } from '../[trade]/_ui/swap/trade/wrapper'

export const PoolAPR = ({
  version,
  pool,
}: { version: 'v2' | 'v3'; pool: V2Pool | V3Pool }) => {
  const totalApr = pool?.totalApr1d?.toFixed(2)
  const feeApr = pool?.feeApr1d?.toFixed(2)
  const incentivesApr = pool?.incentiveApr?.toFixed(2)
  const incentives = pool?.incentives

  return (
    <Wrapper enableBorder className="!p-4">
      <CardHeader className="!p-0 !pb-5 flex justify-between items-center lg:items-start !flex-row lg:!flex-col gap-2">
        <CardTitle className="text-slate-900 dark:lg:!text-slate-500 dark:!text-slate-100">
          Total APR
        </CardTitle>
        <CardDescription className="!mt-0 font-bold lg:font-medium text-sm lg:!text-2xl flex items-center">
          {totalApr}%
        </CardDescription>
      </CardHeader>
      <CardContent className="!p-0">
        <CardGroup className="!gap-3 lg:!gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-medium text-slate-900 dark:text-slate-100">
              <span>Fee APR {version === 'v3' ? '(Full Range)' : ''}</span>
              <span>{feeApr}%</span>
            </div>
            <span className="hidden text-sm md:block text-slate-450 dark:text-slate-500">
              Liquidity Pool fees from swap transactions
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-medium text-slate-900 dark:text-slate-100">
              <span className="flex gap-2 items-center">
                Rewards APR{' '}
                {incentives?.map((reward) => (
                  <Currency.Icon
                    key={reward.id}
                    currency={
                      new EvmToken({
                        chainId: pool.chainId,
                        address: reward.rewardToken.address,
                        decimals: reward.rewardToken.decimals,
                        symbol: reward.rewardToken.symbol,
                        name: reward.rewardToken.name,
                      })
                    }
                    width={14}
                    height={14}
                  />
                ))}
              </span>
              <span>{incentivesApr}%</span>
            </div>
            <span className="hidden text-sm lg:block text-slate-450 dark:text-slate-500">
              Boosted rewards{' '}
            </span>
          </div>
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}
