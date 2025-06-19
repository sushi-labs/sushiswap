'use client'

import type { V4Pool } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
  Container,
  Separator,
  classNames,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { getPoolKey } from 'src/lib/pool/v4'
import { decodeHooksRegistration } from 'src/lib/pool/v4/sdk/utils/decodeHooksRegistration'
import { Amount, Native, Token } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { parseUnits, zeroAddress } from 'viem'
import { ConcentratedLiquidityProvider } from './ConcentratedLiquidityProvider'
import { PoolTransactionsV4 } from './PoolTransactionsV4'
import { StatisticsChartsV4 } from './StatisticsChartV4'

const PoolPageV4: FC<{ pool: V4Pool }> = ({ pool }) => {
  return (
    <ConcentratedLiquidityProvider>
      <Pool pool={pool} />
    </ConcentratedLiquidityProvider>
  )
}

const Pool: FC<{ pool: V4Pool }> = ({ pool }) => {
  const poolKey = useMemo(
    () =>
      getPoolKey({
        chainId: pool.chainId,
        currency0: pool.token0.address,
        currency1: pool.token1.address,
        feeAmount: Number(parseUnits(pool.lpFee.toString(), 6)),
        tickSpacing: pool.tickSpacing,
        hookData: {
          address: pool.hooks,
          hooksRegistration: decodeHooksRegistration(pool.hooksRegistration),
        },
      }),
    [pool],
  )

  const { chainId } = pool

  const reserves = useMemo(() => {
    return [
      Amount.fromRawAmount(
        pool.token0.address === zeroAddress
          ? Native.onChain(pool.chainId)
          : new Token(pool.token0),
        pool.reserve0,
      ),
      Amount.fromRawAmount(
        pool.token1.address === zeroAddress
          ? Native.onChain(pool.chainId)
          : new Token(pool.token1),
        pool.reserve1,
      ),
    ]
  }, [pool.chainId, pool.reserve0, pool.reserve1, pool.token0, pool.token1])

  const fiatValues = useTokenAmountDollarValues({ chainId, amounts: reserves })

  return (
    <Container maxWidth="5xl" className="flex flex-col gap-4 px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatisticsChartsV4 pool={pool} poolKey={poolKey} />
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pool Liquidity</CardTitle>
              <CardDescription>
                {formatUSD(fiatValues[0] + fiatValues[1])}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardGroup>
                <CardLabel>Tokens</CardLabel>
                <CardCurrencyAmountItem
                  amount={reserves?.[0]}
                  fiatValue={formatUSD(fiatValues[0])}
                />
                <CardCurrencyAmountItem
                  amount={reserves?.[1]}
                  fiatValue={formatUSD(fiatValues[1])}
                />
              </CardGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex flex-col justify-between md:flex-row gap-y-4">
                  Statistics
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <CardLabel>Volume (24h)</CardLabel>

                  <div className="text-xl font-semibold">
                    {formatUSD(pool.volumeUSD1d ?? 0)}{' '}
                    <span
                      className={classNames(
                        'text-xs',
                        pool.volumeUSD1dChange > 0 ? 'text-green' : 'text-red',
                      )}
                    >
                      ({pool.volumeUSD1dChange.toFixed(2)}
                      %)
                    </span>
                  </div>
                </div>
                <div>
                  <CardLabel>Fees (24h)</CardLabel>
                  <div className="text-xl font-semibold">
                    {formatUSD(pool.feesUSD1d ?? 0)}{' '}
                    <span
                      className={classNames(
                        'text-xs',
                        pool.feesUSD1dChange > 0 ? 'text-green' : 'text-red',
                      )}
                    >
                      ({pool.feesUSD1dChange.toFixed(2)}
                      %)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="py-4">
        <Separator />
      </div>
      {/* <PoolRewardDistributionsCard pool={pool} /> */}
      <PoolTransactionsV4 pool={pool} />
    </Container>
  )
}

export { PoolPageV4 }
