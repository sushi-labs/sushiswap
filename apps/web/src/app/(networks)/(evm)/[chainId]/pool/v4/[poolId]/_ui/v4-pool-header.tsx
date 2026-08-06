'use client'

import {
  Button,
  Chip,
  Container,
  LinkInternal,
  SkeletonText,
  typographyVariants,
} from '@sushiswap/ui'
import { BackButton } from 'src/app/(networks)/_ui/back-button'
import {
  type SushiSwapV4ChainId,
  type SushiSwapV4PoolId,
  getSushiSwapV4Deployment,
  useSushiSwapV4Pool,
} from 'src/lib/pool/v4'
import { getEvmChainById } from 'sushi/evm'

export function V4PoolHeader({
  chainId: chainIdInput,
  poolId,
}: {
  chainId: number
  poolId: SushiSwapV4PoolId
}) {
  const chainId = chainIdInput as SushiSwapV4ChainId
  const deployment = getSushiSwapV4Deployment(chainId)
  const poolState = useSushiSwapV4Pool({ chainId, deployment, poolId })
  const pool = poolState?.pool
  const basePath = `/${getEvmChainById(chainId).key}/pool/v4/${poolId}`

  return (
    <Container maxWidth="5xl" className="pt-10 px-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <BackButton variant="ghost" name="back" />
          <h1 className={typographyVariants({ variant: 'h3' })}>
            {pool ? (
              `${pool.token0.symbol}/${pool.token1.symbol}`
            ) : !deployment ? (
              `Infinity pool ${poolId.slice(0, 8)}…`
            ) : (
              <SkeletonText fontSize="2xl" className="w-44" />
            )}
          </h1>
          <Chip variant="blue">SushiSwap V4</Chip>
          {poolState && !poolState.isInitialized ? (
            <Chip variant="secondary">Uninitialized</Chip>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <LinkInternal href={`${basePath}/create`}>
              Create position
            </LinkInternal>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <LinkInternal href={`${basePath}/positions`}>
              My positions
            </LinkInternal>
          </Button>
        </div>
      </div>
    </Container>
  )
}
