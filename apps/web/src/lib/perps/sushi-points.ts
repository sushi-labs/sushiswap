import type { PerpsPointsSeason } from '@sushiswap/graph-client/data-api'
import type { EvmAddress } from 'sushi/evm'

export const sushiPointsQueryKeys = {
  overview: (
    address: EvmAddress | undefined,
    season: PerpsPointsSeason | undefined,
  ) => ['sushiPointsOverview', address, season] as const,
  history: (
    address: EvmAddress | undefined,
    from: string | undefined,
    to: string | undefined,
    season: PerpsPointsSeason | undefined,
  ) => ['sushiPointsHistory', address, from, to, season] as const,
}
