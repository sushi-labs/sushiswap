import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../types'
import { TokenCard } from './token-card'

export function TokenGrid({
  tokens,
  sortBy,
  manage,
}: {
  tokens: LaunchpadToken[]
  sortBy?: LaunchpadTokenSortField
  manage?: boolean
}) {
  if (tokens.length === 0) {
    return (
      <PerpsCard
        className="grid min-h-64 place-items-center p-8 text-center"
        fullWidth
      >
        <div>
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.05] text-perps-muted-50">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </span>
          <h3 className="mt-4 font-semibold text-perps-muted">
            No launches found
          </h3>
          <p className="mt-1 text-sm text-perps-muted-50">
            Try another name, symbol, token address, or creator.
          </p>
        </div>
      </PerpsCard>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {tokens.map((token) => (
        <TokenCard
          key={token.id}
          token={token}
          sortBy={sortBy}
          manage={manage}
        />
      ))}
    </div>
  )
}
