import type { EvmAddress } from 'sushi/evm'

export const sushiPointsQueryKeys = {
  overview: (address: EvmAddress | undefined) =>
    ['sushiPointsOverview', address] as const,
  history: (
    address: EvmAddress | undefined,
    from: string | undefined,
    to: string | undefined,
  ) => ['sushiPointsHistory', address, from, to] as const,
}
