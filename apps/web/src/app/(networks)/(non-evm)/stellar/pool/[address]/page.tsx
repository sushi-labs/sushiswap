'use client'
import { Container } from '@sushiswap/ui'
import React, { use } from 'react'
import { MyPosition } from '~stellar/_common/ui/PoolDetails/MyPosition'
import { PoolDetails } from '~stellar/_common/ui/PoolDetails/PoolDetails'
import { usePoolDetails } from '../../_common/lib/hooks/use-pool-details'

interface PoolPageProps {
  params: Promise<{
    address: string
  }>
}

export default function PoolPage({ params }: PoolPageProps) {
  const resolvedParams = use(params)
  const address = decodeURIComponent(resolvedParams.address)
  const { data: pool, isLoading, error } = usePoolDetails({ address })

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <PoolDetails pool={pool} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <MyPosition pool={pool} />
          </div>
        </div>
      </div>
    </Container>
  )
}
