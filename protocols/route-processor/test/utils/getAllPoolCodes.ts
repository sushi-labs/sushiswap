import { DataFetcher, LiquidityProviders, PoolCode } from '@sushiswap/router'
import { loadPoolSnapshot, savePoolSnapshot } from '@sushiswap/router'
import { ChainId } from 'sushi/chain'
import {
  DAI,
  DAI_ADDRESS,
  FRAX,
  FRAX_ADDRESS,
  FXS,
  FXS_ADDRESS,
  SUSHI,
  SUSHI_ADDRESS,
  Token,
  USDC,
  USDC_ADDRESS,
  USDT,
  USDT_ADDRESS,
  WNATIVE,
} from 'sushi/currency'

export async function getAllPoolCodes(
  dataFetcher: DataFetcher,
  chainId: ChainId,
  blockNumber: number | undefined,
): Promise<PoolCode[]> {
  let poolCodes = loadPoolSnapshot(chainId, blockNumber)
  if (poolCodes === undefined) {
    const fetchedTokens: Token[] = [
      WNATIVE[chainId],
      SUSHI[chainId as keyof typeof SUSHI_ADDRESS],
      USDC[chainId as keyof typeof USDC_ADDRESS],
      USDT[chainId as keyof typeof USDT_ADDRESS],
      DAI[chainId as keyof typeof DAI_ADDRESS],
      FRAX[chainId as keyof typeof FRAX_ADDRESS],
      FXS[chainId as keyof typeof FXS_ADDRESS],
    ]
    const foundPools: Set<string> = new Set()
    poolCodes = []

    console.log('  Fetching pools data ...')
    for (let i = 0; i < fetchedTokens.length; ++i) {
      for (let j = i + 1; j < fetchedTokens.length; ++j) {
        console.log(
          `    ${fetchedTokens[i].symbol} - ${fetchedTokens[j].symbol}`,
        )
        for (let p = 0; p < dataFetcher.providers.length; ++p) {
          const provider = dataFetcher.providers[p]
          await provider.fetchPoolsForToken(
            fetchedTokens[i],
            fetchedTokens[j],
            foundPools,
          )
          const pc = provider.getCurrentPoolList(
            fetchedTokens[i],
            fetchedTokens[j],
          )
          let newPools = 0
          pc.forEach((p) => {
            if (!foundPools.has(p.pool.uniqueID())) {
              ;(poolCodes as PoolCode[]).push(p)
              foundPools.add(p.pool.uniqueID())
              ++newPools
            }
          })
          if (newPools)
            console.log(
              `      ${provider.getPoolProviderName()} pools: ${newPools}`,
            )
        }
      }
    }
    savePoolSnapshot(poolCodes, chainId, blockNumber)
  }
  const providers = new Map<LiquidityProviders, number>()
  poolCodes.forEach((p) => {
    const count = providers.get(p.liquidityProvider) || 0
    providers.set(p.liquidityProvider, count + 1)
  })
  Array.from(providers.entries()).forEach(([provider, count]) =>
    console.log(`    ${provider} pools: ${count}`),
  )
  console.log('    All providers pools:', poolCodes.length)

  return poolCodes as PoolCode[]
}
