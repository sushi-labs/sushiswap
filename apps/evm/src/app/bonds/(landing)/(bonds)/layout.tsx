'use client'

import { BondsFiltersProvider } from '../../../../ui/bonds/bonds-table/bonds-table-filters/bonds-filters-provider'

export default function BondsLayout({
  children,
}: { children: React.ReactNode }) {
  return <BondsFiltersProvider>{children}</BondsFiltersProvider>
}
