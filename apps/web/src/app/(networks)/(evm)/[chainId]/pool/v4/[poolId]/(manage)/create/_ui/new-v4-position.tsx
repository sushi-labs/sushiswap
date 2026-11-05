'use client'

import type { SushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@sushiswap/ui'
import { type ReactElement, useMemo, useState } from 'react'
import { useV4PoolById } from 'src/lib/pool/v4'
import { getEvmChainById } from 'sushi/evm'
import type { Hex } from 'viem'
import { useV4DerivedMintInfo } from '../../../../_ui/use-v4-derived-mint-info'
import { V4LiquidityWidget } from '../../../../_ui/v4-liquidity-widget'
import { V4SelectPricesWidget } from '../../../../_ui/v4-select-prices-widget'

export function NewV4Position({
  chainId,
  poolId,
}: {
  chainId: SushiSwapV4ChainId
  poolId: Hex
}): ReactElement {
  const [invert, setInvert] = useState(false)
  const { data: pool, isLoading } = useV4PoolById({ chainId, poolId })

  const [currencyA, currencyB] = useMemo(() => {
    if (!pool) return [undefined, undefined]
    return invert
      ? [pool.currency1, pool.currency0]
      : [pool.currency0, pool.currency1]
  }, [pool, invert])

  const derived = useV4DerivedMintInfo({
    currencyA,
    currencyB,
    pool,
    isPoolLoading: isLoading,
    poolConfig: undefined,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>New position</CardTitle>
        <CardDescription>
          Create a new concentrated liquidity position
        </CardDescription>
      </CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent>
        <V4SelectPricesWidget
          chainId={chainId}
          currencyA={currencyA}
          currencyB={currencyB}
          poolId={poolId}
          derived={derived}
          switchTokens={() => setInvert((prev) => !prev)}
        />
        <V4LiquidityWidget
          chainId={chainId}
          currencyA={currencyA}
          currencyB={currencyB}
          derived={derived}
          successLink={`/${getEvmChainById(chainId).key}/pool/v4/${poolId}/positions`}
        />
      </CardContent>
    </Card>
  )
}
