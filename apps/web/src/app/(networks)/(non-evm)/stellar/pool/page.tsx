'use client'
import { Container } from '@sushiswap/ui'
import React from 'react'
import { Pool } from '../_common/ui/Pool/Pool'

export default function PoolPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <Pool />
    </Container>
  )
}
