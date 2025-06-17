import {
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { useEffect, useMemo } from 'react'
import { Decimal } from 'sushi'
import { formatUSD } from 'sushi/format'
import { useLpBalance } from '~kadena/_common/lib/hooks/pools/use-lp-balance'
import { useTokenPrice } from '~kadena/_common/lib/hooks/use-token-price'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { WalletConnector } from '../../WalletConnector/WalletConnector'
import { LiquidityItem } from '../PoolDetails/LiquidityItem'
import {
  useRemoveLiqDispatch,
  useRemoveLiqState,
} from '../Remove/pool-remove-provider'
import { usePoolState } from '../pool-provider'

export type TempToken = {
  tokenName: string
  tokenId?: string
  tokenSymbol: string
  tokenImage: string
  tokenDecimals?: number
  tokenAddress?: string
}

export const PoolPosition = () => {
  const token0StakedInUsd = 0
  const token1StakedInUsd = 0
  const { reserve0, reserve1, token0, token1, isLoadingPool } = usePoolState()
  const { totalSupplyLP, lpBalance } = useRemoveLiqState()
  const { setLPBalance } = useRemoveLiqDispatch()
  const { activeAccount } = useKadena()
  const address = activeAccount?.accountName || ''

  const { data: priceUsd0, isLoading: isLoadingPrice0 } = useTokenPrice({
    token: token0,
  })
  const { data: priceUsd1, isLoading: isLoadingPrice1 } = useTokenPrice({
    token: token1,
  })

  const { data, isLoading } = useLpBalance({
    account: address,
    token0Address: token0?.tokenAddress,
    token1Address: token1?.tokenAddress,
  })

  useEffect(() => {
    if (data?.balance !== undefined) {
      setLPBalance(data?.balance)
    }
  }, [data, setLPBalance])

  const token0Price = priceUsd0 ?? 0
  const token1Price = priceUsd1 ?? 0

  const amountToken0: number = useMemo(() => {
    if (!lpBalance || !reserve0) return 0
    const fraction = new Decimal(lpBalance).div(totalSupplyLP)
    return fraction.mul(reserve0).toNumber()
  }, [lpBalance, reserve0, totalSupplyLP])

  const amountToken1: number = useMemo(() => {
    if (!lpBalance || !reserve1) return 0
    const fraction = new Decimal(lpBalance).div(totalSupplyLP)
    return fraction.mul(reserve1).toNumber()
  }, [lpBalance, reserve1, totalSupplyLP])

  const loading =
    isLoading || isLoadingPrice0 || isLoadingPrice1 || isLoadingPool

  const token0UnstakedInUsd = Number(token0Price) * Number(amountToken0)
  const token1UnstakedInUsd = Number(token1Price) * Number(amountToken1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Position</CardTitle>
        {!address ? null : (
          <CardDescription>
            <span className="text-sm text-right text-gray-900 dark:text-slate-50">
              {loading ? (
                <div className="w-28">
                  <SkeletonText fontSize="sm" />
                </div>
              ) : (
                formatUSD(
                  token0StakedInUsd +
                    token1StakedInUsd +
                    token0UnstakedInUsd +
                    token1UnstakedInUsd,
                )
              )}
            </span>
          </CardDescription>
        )}
      </CardHeader>
      {!address ? (
        <CardContent>
          <CardGroup>
            <WalletConnector fullWidth variant="secondary" />
          </CardGroup>
        </CardContent>
      ) : (
        <CardContent>
          <CardGroup>
            <LiquidityItem
              isLoading={loading}
              token={token0}
              amount={amountToken0}
              usdAmount={String(token0UnstakedInUsd)}
            />
            <LiquidityItem
              isLoading={loading}
              token={token1}
              amount={amountToken1}
              usdAmount={String(token1UnstakedInUsd)}
            />
          </CardGroup>
        </CardContent>
      )}
    </Card>
  )
}
