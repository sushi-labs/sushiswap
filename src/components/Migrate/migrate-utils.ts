import { Pair } from '@sushiswap/core-sdk'
import { Fee } from '@sushiswap/trident-sdk'
import { TridentPool } from 'app/services/graph'

export const deDupe = (value: any, i: number, arr: any[]) => arr.indexOf(value) === i

const tridentPoolMatches = (pair: Pair, tridentPools: TridentPool[]) => {
  return tridentPools.filter((pool) => {
    /* Cannot transfer to pools with more than two assets */
    if (pool.assets.length !== 2) return false

    const tridentAddress0 = pool.assets[0].address.toLowerCase()
    const tridentAddress1 = pool.assets[1].address.toLowerCase()
    const v2Address0 = pair.token0.address.toLowerCase()
    const v2Address1 = pair.token1.address.toLowerCase()
    return (
      (tridentAddress0 === v2Address0 && tridentAddress1 === v2Address1) ||
      (tridentAddress0 === v2Address1 && tridentAddress1 === v2Address0)
    )
  })
}

export type AvailablePoolConfig = { fee: Fee; twap: boolean }

const getAvailablePoolOptions = (matches: TridentPool[]): AvailablePoolConfig[] => {
  const configs: AvailablePoolConfig[] = []

  /* Loop through Fee enum, excluding keys */
  for (const fee of Object.values(Fee).filter(Number) as Fee[]) {
    const twapMatches = matches
      .filter((pool) => pool.swapFee === fee)
      .map((pool) => pool.twapEnabled)
      .filter(deDupe)

    /* both TWAP values represented already */
    if (twapMatches.length === 2) continue

    /* need to represent the opposite twap option */
    if (twapMatches.length === 1) {
      configs.push({ fee, twap: !twapMatches[0] })
    }

    /* both twap options for this fee tier are available */
    if (!twapMatches.length) {
      configs.push({ fee, twap: true })
      configs.push({ fee, twap: false })
    }
  }

  return configs
}

export const matchV2PairWithTridentPools = (pair: Pair, tridentPools: TridentPool[]) => {
  const matches = tridentPoolMatches(pair, tridentPools)
  return {
    matches,
    availableToCreate: getAvailablePoolOptions(matches),
  }
}
