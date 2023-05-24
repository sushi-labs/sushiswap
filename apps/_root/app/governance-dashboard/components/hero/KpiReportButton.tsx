'use client'

import { useBreakpoint } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/future/components/button'
import React from 'react'

export function KpiReportButton() {
  const { isMd } = useBreakpoint('md')

  return (
    <Button size={isMd ? 'xl' : 'md'}>
      {/** TODO: */}
      Q1 2023 KPIs Report
    </Button>
  )
}
