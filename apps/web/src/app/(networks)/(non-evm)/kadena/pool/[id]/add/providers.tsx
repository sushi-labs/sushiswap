import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'
import { RemoveProvider } from '~kadena/_common/ui/Pools/Remove/pool-remove-provider'
import { PoolProvider } from '~kadena/pool/pool-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PoolsFiltersProvider>
      <PoolProvider>
        <RemoveProvider>{children}</RemoveProvider>
      </PoolProvider>
    </PoolsFiltersProvider>
  )
}
