'use client'

import { Container } from '@sushiswap/ui/components/container'
import React from 'react'

import { PoolsFiltersProvider, PoolsSection } from '../../ui/pool'
import { Hero } from './hero'

export default async function PoolPage() {
  return (
    <>
      <Container maxWidth="7xl">
        <Hero />
      </Container>
      <PoolsFiltersProvider>
        <PoolsSection />
      </PoolsFiltersProvider>
    </>
  )
}
