import type { Address } from 'viem'
import type { SteerVault } from '../types/steer-vault.js'

interface GetTokenRatiosProps {
  vault: Pick<
    SteerVault,
    'chainId' | 'token0' | 'token1' | 'reserve0' | 'reserve1'
  >
  prices: Pick<Map<Address, number>, 'get' | 'has'>
}

function getTokenRatios({ vault, prices }: GetTokenRatiosProps) {
  const token0PriceUSD = prices.get(vault.token0.address) || 0
  const token1PriceUSD = prices.get(vault.token1.address) || 0

  const reserve0 = Number(vault.reserve0) / 10 ** vault.token0.decimals
  const reserve1 = Number(vault.reserve1) / 10 ** vault.token1.decimals

  const reserve0USD = reserve0 * token0PriceUSD
  const reserve1USD = reserve1 * token1PriceUSD

  const totalReserveUSD = reserve0USD + reserve1USD

  if (totalReserveUSD === 0) return { token0: 0, token1: 0 }

  let [token0, token1] = [
    reserve0USD / totalReserveUSD,
    reserve1USD / totalReserveUSD,
  ]

  token0 = token0 < 0.00001 ? 0 : Math.min(token0, 1)
  token1 = token1 < 0.00001 ? 0 : Math.min(token1, 1)

  return {
    token0,
    token1,
  }
}

export { getTokenRatios }
