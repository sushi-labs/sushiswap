import { RemoveProvider } from '~kadena/_common/ui/Pools/Remove/pool-remove-provider'
import { PoolProvider } from '~kadena/pool/pool-provider'
import { PoolsFiltersProvider } from '../pool-filters-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PoolsFiltersProvider>
      <PoolProvider>
        <RemoveProvider>{children}</RemoveProvider>
      </PoolProvider>
    </PoolsFiltersProvider>
  )
}
