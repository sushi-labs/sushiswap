'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Message,
  Separator,
} from '@sushiswap/ui'
import {
  type SushiSwapV4ChainId,
  type SushiSwapV4PoolId,
  getSushiSwapV4Deployment,
  isSushiSwapV4FeeAmount,
  useSushiSwapV4Pool,
} from 'src/lib/pool/v4'
import { EvmNative, getEvmChainById } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { useConnection } from 'wagmi'
import { SelectPricesWidget } from '~evm/[chainId]/_ui/select-prices-widget'
import { ConcentratedLiquidityWidget } from '~evm/[chainId]/pool/v3/_ui/concentrated-liquidity-widget'

export function V4NewPosition({
  chainId: chainIdInput,
  poolId,
}: {
  chainId: number
  poolId: SushiSwapV4PoolId
}) {
  const chainId = chainIdInput as SushiSwapV4ChainId
  const { address } = useConnection()
  const deployment = getSushiSwapV4Deployment(chainId)
  const poolState = useSushiSwapV4Pool({ chainId, deployment, poolId })
  const pool = poolState?.pool
  const feeAmount = poolState?.poolKey.fee

  if (!deployment) {
    return (
      <Message variant="warning">
        SushiSwap V4 deployment addresses are not configured for this network.
      </Message>
    )
  }

  if (
    !poolState ||
    !pool ||
    feeAmount === undefined ||
    !isSushiSwapV4FeeAmount(feeAmount)
  ) {
    return (
      <Message variant={poolState?.isError ? 'destructive' : 'warning'}>
        {poolState?.isError
          ? 'This Infinity pool could not be loaded.'
          : 'Loading the Infinity pool…'}
      </Message>
    )
  }

  const token0 =
    poolState.poolKey.currency0 === zeroAddress
      ? EvmNative.fromChainId(chainId)
      : pool.token0
  const token1 =
    poolState.poolKey.currency1 === zeroAddress
      ? EvmNative.fromChainId(chainId)
      : pool.token1
  const infinity = {
    deployment,
    poolKey: poolState.poolKey,
    poolId,
    isInitialized: poolState.isInitialized,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New V4 position</CardTitle>
        <CardDescription>
          Create a concentrated liquidity position in this Infinity pool.
        </CardDescription>
      </CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent>
        <SelectPricesWidget
          chainId={chainId}
          token0={token0}
          token1={token1}
          poolAddress={undefined}
          feeAmount={feeAmount}
          tokenId={undefined}
          poolState={poolState}
        />
        <ConcentratedLiquidityWidget
          chainId={chainId}
          account={address}
          token0={token0}
          token1={token1}
          feeAmount={feeAmount}
          tokensLoading={poolState.isInitialLoading}
          existingPosition={undefined}
          tokenId={undefined}
          poolState={poolState}
          infinity={infinity}
          successLink={`/${getEvmChainById(chainId).key}/pool/v4/${poolId}/positions`}
        />
      </CardContent>
    </Card>
  )
}
