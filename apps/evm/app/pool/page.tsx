'use client'

import { Container } from '@sushiswap/ui/components/container'
import React from 'react'

import { PoolsFiltersProvider, PoolsSection } from '../../ui/pool'
import { Hero } from './hero'

export default async function PoolPage() {
  return (
    <>
      <Container maxWidth="full" className="mx-auto px-4 pt-[80px] lg:pb-[54px]">
        <Hero />
      </Container>
      <PoolsFiltersProvider>
        <PoolsSection />
      </PoolsFiltersProvider>
    </>
  )
}
