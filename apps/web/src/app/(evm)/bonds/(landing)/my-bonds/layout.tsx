import { BondsPositionsFiltersProvider } from 'src/ui/bonds/bonds-positions-table/bonds-positions-table-filters/bonds-positions-filters-provider'

export default function MyBondsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <BondsPositionsFiltersProvider>{children}</BondsPositionsFiltersProvider>
  )
}
