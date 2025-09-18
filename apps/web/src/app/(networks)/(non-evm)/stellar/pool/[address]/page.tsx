'use client'
import { Container } from '@sushiswap/ui'
import React, { use } from 'react'
import { PoolDetails } from '~stellar/_common/ui/PoolDetails/PoolDetails'
import { usePoolDetails } from '../../_common/lib/hooks/use-pool-details'

interface PoolPageProps {
  params: Promise<{
    address: string
  }>
}

export default function PoolPage({ params }: PoolPageProps) {
  const resolvedParams = use(params)
  const {
    data: pool,
    isLoading,
    error,
  } = usePoolDetails({ address: resolvedParams.address })

  if (isLoading) {
    return (
      <Container maxWidth="7xl" className="px-4">
        <div>Loading pool...</div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="7xl" className="px-4">
        <div>Error loading pool: {error.message}</div>
      </Container>
    )
  }

  if (!pool) {
    return (
      <Container maxWidth="7xl" className="px-4">
        <div>Pool not found</div>
      </Container>
    )
  }

  return (
    <Container maxWidth="7xl" className="px-4">
      <PoolDetails pool={pool} />
    </Container>
  )
}
