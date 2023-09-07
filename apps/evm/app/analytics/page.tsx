'use client'

import { Container, typographyVariants } from '@sushiswap/ui'

import { ChartSection, TableSection } from './components'
import { FilterProvider } from './components/Filters'

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-10">
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <div className="flex flex-col">
          <h1 className={typographyVariants({ variant: 'h1' })}>Analytics.</h1>
          <p className={typographyVariants({ variant: 'lead', className: 'max-w-[500px]' })}>
            Providing liquidity to a pool allows you to earn a percentage of the pools traded volume as well as any
            extra rewards if the pool is incentivized.
          </p>
        </div>
      </Container>
      <FilterProvider>
        <ChartSection />
        <TableSection />
      </FilterProvider>
    </div>
  )
}
