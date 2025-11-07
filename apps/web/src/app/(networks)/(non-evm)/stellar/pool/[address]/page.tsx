'use client'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  LinkInternal,
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
  const { data: pool, isLoading, error } = usePoolInfo(address)
  const { isConnected } = useStellarWallet()

  // Check if pool is initialized
  const { data: initialized } = usePoolInitialized(address)

  if (isLoading) {
    return (
      <Container maxWidth="5xl" className="px-4">
        <div className="flex flex-col gap-8">
          <div>Loading pool...</div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="5xl" className="px-4">
        <div className="flex flex-col gap-8">
          <div>Error loading pool: {error.message}</div>
        </div>
      </Container>
    )
  }

  if (!pool) {
    return (
      <Container maxWidth="5xl" className="px-4">
        <div className="flex flex-col gap-8">
          <div>Pool not found</div>
        </div>
      </Container>
    )
  }

  // Show initialization prompt if pool is not initialized
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
                <ConnectWalletButton className="w-full" size="lg" />
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
            <PoolLiquidity pool={pool} />
          </div>
          <div className="flex flex-col gap-4">
            <MyPosition pool={pool} />
          </div>
        </div>
      </div>
    </Container>
  )
}
