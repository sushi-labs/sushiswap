'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  List,
  Message,
  SkeletonText,
} from '@sushiswap/ui'
import {
  type SushiSwapV4ChainId,
  type SushiSwapV4PoolId,
  getSushiSwapV4Deployment,
  useSushiSwapV4Pool,
} from 'src/lib/pool/v4'

export function V4PoolDetails({
  chainId: chainIdInput,
  poolId,
}: {
  chainId: number
  poolId: SushiSwapV4PoolId
}) {
  const chainId = chainIdInput as SushiSwapV4ChainId
  const deployment = getSushiSwapV4Deployment(chainId)
  const poolState = useSushiSwapV4Pool({ chainId, deployment, poolId })

  if (!deployment) {
    return (
      <Message variant="warning">
        SushiSwap V4 deployment addresses are not configured for this network.
      </Message>
    )
  }

  if (poolState?.isError) {
    return (
      <Message variant="destructive">
        This Infinity pool could not be read from the configured pool manager.
      </Message>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pool state</CardTitle>
        </CardHeader>
        <CardContent>
          {!poolState ? (
            <SkeletonText fontSize="lg" className="w-full" />
          ) : (
            <List>
              <List.Control>
                <List.KeyValue title="Pool ID">
                  <span className="font-mono text-xs break-all">{poolId}</span>
                </List.KeyValue>
                <List.KeyValue title="Fee tier">
                  {poolState.poolKey.fee / 10_000}%
                </List.KeyValue>
                <List.KeyValue title="Tick spacing">
                  {poolState.poolKey.parameters.tickSpacing}
                </List.KeyValue>
                <List.KeyValue title="Active liquidity">
                  {poolState.pool?.liquidity.toString() ?? '0'}
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Official PoolKey</CardTitle>
        </CardHeader>
        <CardContent>
          {!poolState ? (
            <SkeletonText fontSize="lg" className="w-full" />
          ) : (
            <List>
              <List.Control>
                {Object.entries({
                  currency0: poolState.poolKey.currency0,
                  currency1: poolState.poolKey.currency1,
                  hooks: poolState.poolKey.hooks,
                  poolManager: poolState.poolKey.poolManager,
                }).map(([label, value]) => (
                  <List.KeyValue key={label} title={label}>
                    <span className="font-mono text-xs break-all">{value}</span>
                  </List.KeyValue>
                ))}
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
