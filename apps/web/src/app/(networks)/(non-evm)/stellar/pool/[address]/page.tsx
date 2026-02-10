'use client'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  LinkInternal,
  SkeletonBox,
} from '@sushiswap/ui'
import React, { use } from 'react'
import { usePoolInfo } from '~stellar/_common/lib/hooks/pool/use-pool-info'
import { usePoolInitialized } from '~stellar/_common/lib/hooks/pool/use-pool-initialized'
import { ConnectWalletButton } from '~stellar/_common/ui/ConnectWallet/ConnectWalletButton'
import {
  ManageLiquidityCard,
  PoolLiquidity,
} from '~stellar/_common/ui/PoolDetails'
import { MyPosition } from '~stellar/_common/ui/PoolDetails/MyPosition'
import { useStellarWallet } from '~stellar/providers'

interface PoolPageProps {
  params: Promise<{
    address: string
  }>
}

export default function PoolPage({ params }: PoolPageProps) {
  const resolvedParams = use(params)
  const address = decodeURIComponent(resolvedParams.address)
  const {
    data: pool,
    isPending: isPendingPool,
    isFetching: isFetchingPool,
    error: poolError,
    refetch: refetchPool,
  } = usePoolInfo(address)
  const { isConnected } = useStellarWallet()

  // Check if pool is initialized
  const {
    data: initialized,
    isPending: isPendingInitialized,
    isFetching: isFetchingInitialized,
    error: initializedError,
    refetch: refetchInitialized,
  } = usePoolInitialized(address)

  const isPending = isPendingPool || isPendingInitialized
  const isFetching = isFetchingPool || isFetchingInitialized
  const hasError = poolError || initializedError

  // Show loading state while either query is loading
  if (isPending || isFetching) {
    return (
      <Container maxWidth="5xl" className="px-4">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <SkeletonBox className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <SkeletonBox className="h-32 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <SkeletonBox className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <SkeletonBox className="h-24 w-full" />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <SkeletonBox className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <SkeletonBox className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    )
  }

  // Show error state with retry button
  if (hasError) {
    const errorMessage =
      poolError?.message || initializedError?.message || 'Unknown error'
    return (
      <Container maxWidth="5xl" className="px-4">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Failed to load pool data. This may be due to a temporary network
                issue.
              </p>
              <p className="text-sm text-red-500">{errorMessage}</p>
              <Button
                onClick={() => {
                  refetchPool()
                  refetchInitialized()
                }}
                disabled={isFetching}
                className="w-full"
                size="lg"
              >
                {isFetching ? 'Retrying...' : 'Retry'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    )
  }

  // Pool data loaded but pool doesn't exist
  if (!pool) {
    return (
      <Container maxWidth="5xl" className="px-4">
        <Card>
          <CardHeader>
            <CardTitle>Pool Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This pool could not be found. It may not exist or may have been
                removed.
              </p>
              <LinkInternal href="/stellar/explore/pools">
                <Button className="w-full" size="lg" variant="secondary">
                  Browse All Pools
                </Button>
              </LinkInternal>
            </div>
          </CardContent>
        </Card>
      </Container>
    )
  }

  // Show initialization prompt if pool is not initialized
  // Only show this if we explicitly know initialized === false (not undefined or error)
  if (initialized === false) {
    return (
      <Container maxWidth="5xl" className="px-4">
        <Card>
          <CardHeader>
            <CardTitle>Pool Not Initialized</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This pool has been created but not yet initialized with a
                starting price. You need to initialize it by adding liquidity
                and setting the initial price ratio.
              </p>
              <p className="text-sm text-muted-foreground">
                Enter the desired token amounts to set the initial price for
                this pool.
              </p>
              {!isConnected ? (
                <ConnectWalletButton fullWidth size="lg" />
              ) : (
                <LinkInternal href="/stellar/pool/add">
                  <Button className="w-full" size="lg">
                    Initialize Pool &amp; Add Liquidity
                  </Button>
                </LinkInternal>
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container maxWidth="5xl" className="px-4">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <ManageLiquidityCard pool={pool} />
          </div>
          <div className="flex flex-col gap-4">
            <PoolLiquidity pool={pool} />
            <MyPosition pool={pool} />
          </div>
        </div>
      </div>
    </Container>
  )
}
