'use client'
import { Container } from '@sushiswap/ui'
import React, { use } from 'react'
import { usePoolInfo } from '~stellar/_common/lib/hooks/pool/use-pool-info'
import {
  ManageLiquidityCard,
  PoolLiquidity,
} from '~stellar/_common/ui/PoolDetails'
import { MyPosition } from '~stellar/_common/ui/PoolDetails/MyPosition'

interface PoolPageProps {
  params: Promise<{
    address: string
  }>
}

export default function PoolPage({ params }: PoolPageProps) {
  const resolvedParams = use(params)
  const address = decodeURIComponent(resolvedParams.address)
  const { data: pool, isLoading, error } = usePoolInfo(address)

  console.log({ pool })

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

  return (
    <Container maxWidth="5xl" className="px-4">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <ManageLiquidityCard pool={pool} />
            <PoolLiquidity pool={pool} />
          </div>
          <div>
            <MyPosition pool={pool} />
          </div>
        </div>
      </div>
    </Container>
  )
}
