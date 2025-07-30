'use client'
import { Container } from '@sushiswap/ui'
import React from 'react'
import { ExplorePools } from '~stellar/_common/ui/ExplorePools/ExplorePools'

export default function PoolsPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <ExplorePools />
    </Container>
  )
}
