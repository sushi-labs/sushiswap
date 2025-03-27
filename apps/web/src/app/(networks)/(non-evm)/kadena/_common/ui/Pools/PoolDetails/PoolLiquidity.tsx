import {
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { useEffect, useState } from 'react'
import { formatUSD } from 'sushi/format'
import { formatUnitsForInput } from '~kadena/_common/lib/utils/formatters'
import type { IToken } from '~kadena/_common/types/token-type'
import { LiquidityItem } from './LiquidityItem'

export const PoolLiquidity = ({
  token0,
  token1,
  isLoading,
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  pairAddress,
}: {
  token0: IToken | undefined
  token1: IToken | undefined
  isLoading: boolean
  pairAddress: string
}) => {
  const data = [
    {
      reserve: '123',
      address:
        'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2',
      decimals: 12,
      logoURI: '',
      name: 'Token1',
      symbol: 'TKN1',
    },
  ]
  const [isLoadingReserves, setIsLoadingReserves] = useState(true)
  const [isToken0PriceLoading, setIsToken0PriceLoading] = useState(true)
  const [isToken1PriceLoading, setIsToken1PriceLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingReserves(false)
      setIsToken0PriceLoading(false)
      setIsToken1PriceLoading(false)
    }, 1200)
  }, [])

  const reserve0 = data?.[0]?.reserve ?? '0'
  const reserve0Formatted = formatUnitsForInput(reserve0, token0?.decimals ?? 0)

  const reserve1 = data?.[1]?.reserve ?? '0'
  const reserve1Formatted = formatUnitsForInput(reserve1, token1?.decimals ?? 0)

  const token0Price = '.123'
  const token1Price = '.243'

  const token0PoolPrice = (
    Number(token0Price) * Number(reserve0Formatted)
  ).toString(10)
  const token1PoolPrice = (
    Number(token1Price) * Number(reserve1Formatted)
  ).toString(10)

  const isLoadingData =
    isLoading ||
    isLoadingReserves ||
    isToken0PriceLoading ||
    isToken1PriceLoading

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
        {!token0Price || !token1Price ? (
          <div className="w-28">
            <SkeletonText fontSize="sm" />
          </div>
        ) : (
          <CardDescription>
            {formatUSD(Number(token0PoolPrice) + Number(token1PoolPrice))}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <LiquidityItem
            isLoading={isLoadingData}
            token={token0}
            amount={reserve0}
            usdAmount={token0PoolPrice}
          />
          <LiquidityItem
            isLoading={isLoadingData}
            token={token1}
            amount={reserve1}
            usdAmount={token1PoolPrice}
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
