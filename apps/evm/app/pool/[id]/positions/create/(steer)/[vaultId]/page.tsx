import { getSteerVault } from '@sushiswap/client'
import { SteerVault } from '@sushiswap/client/src/pure/steer-vault/vault'
import { Token } from '@sushiswap/currency'
import { formatNumber, unsanitize } from '@sushiswap/format'
import { tickToPrice } from '@sushiswap/v3-sdk'
import { SteerStrategyComponents, SteerStrategyGeneric } from 'ui/pool/Steer/Strategies'

function getPriceExtremes(vault: SteerVault): SteerStrategyGeneric['priceExtremes'] {
  const token0 = new Token({ chainId: vault.pool.chainId, ...vault.pool.token0 })
  const token1 = new Token({ chainId: vault.pool.chainId, ...vault.pool.token1 })

  let lowerPrice = tickToPrice(token0, token1, vault.lowerTick).toSignificant(7)
  let upperPrice = tickToPrice(token0, token1, vault.upperTick).toSignificant(7)

  lowerPrice = lowerPrice.length > 9 ? formatNumber(lowerPrice) : lowerPrice
  upperPrice = upperPrice.length > 9 ? formatNumber(upperPrice) : upperPrice

  return { min: lowerPrice, max: upperPrice }
}

function getTokenRatios(vault: SteerVault): SteerStrategyGeneric['tokenRatios'] {
  const [reserve0, reserve1] = [Number(vault.reserve0), Number(vault.reserve1)]
  const totalReserve = reserve0 + reserve1

  if (totalReserve === 0) return { token0: 0, token1: 0 }

  let [token0, token1] = [reserve0 / totalReserve, reserve1 / totalReserve]

  token0 = token0 < 0.001 ? 0 : token0
  token1 = token1 < 0.001 ? 0 : token1

  return {
    token0,
    token1,
  }
}

export default async function SteerVaultPage({ params }: { params: { vaultId: string } }) {
  const vaultId = unsanitize(params.vaultId)

  const vault = await getSteerVault(vaultId)

  const Component = SteerStrategyComponents[vault.strategy]

  const priceExtremes = getPriceExtremes(vault)
  const tokenRatios = getTokenRatios(vault)

  return <Component vault={vault} generic={{ priceExtremes, tokenRatios }} />
}
