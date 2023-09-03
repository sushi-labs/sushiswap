import { getTokenPricesChain } from '@sushiswap/client'

interface GetTokenRatiosProps {
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

async function getTokenRatios(vault: GetTokenRatiosProps) {
  let prices
  try {
    prices = await getTokenPricesChain({ chainId: vault.chainId })
  } catch (e) {
    return { token0: 0, token1: 0 }
  }

  const [reserve0USD, reserve1USD] = [
    (Number(vault.reserve0) / 10 ** (vault.token0.decimals - 36)) * prices[vault.token0.address] || 0,
    (Number(vault.reserve1) / 10 ** (vault.token1.decimals - 36)) * prices[vault.token1.address] || 0,
  ]

  const totalReserveUSD = reserve0USD + reserve1USD

  if (totalReserveUSD === 0) return { token0: 0, token1: 0 }

  let [token0, token1] = [reserve0USD / totalReserveUSD, reserve1USD / totalReserveUSD]

  token0 = token0 < 0.00001 ? 0 : token0
  token1 = token1 < 0.00001 ? 0 : token1

  return {
    token0,
    token1,
  }
}

export { getTokenRatios }
