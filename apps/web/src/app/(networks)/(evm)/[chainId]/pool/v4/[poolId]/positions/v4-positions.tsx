'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LinkInternal,
  Message,
  SkeletonText,
} from '@sushiswap/ui'
import {
  type SushiSwapV4ChainId,
  type SushiSwapV4Deployment,
  type SushiSwapV4PoolId,
  getSushiSwapV4Deployment,
  useSushiSwapV4Position,
  useSushiSwapV4PositionIds,
} from 'src/lib/pool/v4'
import { getEvmChainById } from 'sushi/evm'
import { useConnection } from 'wagmi'

export function V4Positions({
  chainId: chainIdInput,
  poolId,
}: {
  chainId: number
  poolId?: SushiSwapV4PoolId
}) {
  const chainId = chainIdInput as SushiSwapV4ChainId
  const { address } = useConnection()
  const deployment = getSushiSwapV4Deployment(chainId)
  const positionIds = useSushiSwapV4PositionIds({
    account: address,
    chainId,
    deployment,
  })

  if (!deployment) {
    return (
      <Message variant="warning">
        SushiSwap V4 deployment addresses are not configured for this network.
      </Message>
    )
  }

  if (!address) {
    return <Message>Connect a wallet to view your V4 positions.</Message>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My V4 positions</CardTitle>
        <CardDescription>
          {poolId
            ? 'Concentrated liquidity NFTs held by your connected wallet for this pool.'
            : 'Infinity concentrated liquidity NFTs held by your connected wallet.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {positionIds.isPending ? (
          <SkeletonText fontSize="lg" className="w-full" />
        ) : positionIds.isError ? (
          <Message variant="destructive">
            Position transfer logs could not be loaded from this network.
          </Message>
        ) : positionIds.data?.length ? (
          positionIds.data.map((tokenId) => (
            <V4PositionRow
              key={tokenId.toString()}
              chainId={chainId}
              deployment={deployment}
              poolId={poolId}
              tokenId={tokenId}
            />
          ))
        ) : (
          <Message>No V4 positions found for this wallet.</Message>
        )}
      </CardContent>
    </Card>
  )
}

function V4PositionRow({
  chainId,
  deployment,
  poolId,
  tokenId,
}: {
  chainId: SushiSwapV4ChainId
  deployment: SushiSwapV4Deployment
  poolId?: SushiSwapV4PoolId
  tokenId: bigint
}) {
  const positionState = useSushiSwapV4Position({
    chainId,
    deployment,
    tokenId,
  })
  const data = positionState.data
  const position = data?.position

  if (poolId && data && data.poolId.toLowerCase() !== poolId.toLowerCase()) {
    return null
  }

  if (!data || !position) {
    return <SkeletonText fontSize="lg" className="w-full" />
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-accent p-4">
      <div>
        <p className="font-medium">
          {position.pool.token0.symbol}/{position.pool.token1.symbol} #
          {tokenId.toString()}
        </p>
        <p className="text-sm text-muted-foreground">
          {position.amount0.toSignificant(6)} {position.pool.token0.symbol} +{' '}
          {position.amount1.toSignificant(6)} {position.pool.token1.symbol}
        </p>
      </div>
      <Button asChild size="sm">
        <LinkInternal
          href={`/${getEvmChainById(chainId).key}/pool/v4/${data.poolId}/${tokenId}`}
        >
          Manage
        </LinkInternal>
      </Button>
    </div>
  )
}
