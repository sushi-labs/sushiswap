import { getAddress } from 'viem'

interface GetTokenRatiosProps {
  vault: {
    chainId: number
    token0: {
      address: string
      decimals: number
    }
    token1: {
      address: string
      decimals: number
    }
    reserve0: string
    reserve1: string
  }
  prices: Record<string, number>
}

async function getTokenRatios({ vault, prices }: GetTokenRatiosProps) {
  const token0PriceUSD = prices[getAddress(vault.token0.address)] || 0
  const token1PriceUSD = prices[getAddress(vault.token1.address)] || 0

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
