import { formatUSD } from '@sushiswap/format'
import { getBuiltGraphSDK, LiquidityPosition } from '@sushiswap/graph-client/.graphclient'

import { CHAIN_NAME_TO_CHAIN_ID, EXCHANGE_SUBGRAPH_NAME, MAKER_ADDRESS } from './../config'

type Arguments = {
  network?: string
  verbose?: boolean
}

export async function serve({ network, verbose }: Arguments) {
  if (!network) {
    throw Error('No network given')
  }

  console.log('serve fees')

  const chainId = CHAIN_NAME_TO_CHAIN_ID[network]

  const sdk = getBuiltGraphSDK({ chainId, subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId] })

  const { liquidityPositions } = await sdk.ExchangeLiquidityPositions({
    first: 10000,
    where: { user: MAKER_ADDRESS[chainId] },
  })

  if (!liquidityPositions) {
    console.error(liquidityPositions)
    throw Error("Response didn't have liquidityPositions")
  }

  console.log('Maker liquidity positons length', liquidityPositions.length)

  const burnPairs = liquidityPositions
    .map((burnPair) => ({
      ...burnPair,
      valueUSD: (burnPair.liquidityTokenBalance / burnPair.pair.totalSupply) * burnPair.pair.reserveUSD,
    }))
    .filter((burnPair) => burnPair.valueUSD > 1000)
    .sort((a, b) => b.valueUSD - a.valueUSD)

  for (const burnPair of burnPairs) {
    console.log(
      `🔥 BURN: ${formatUSD(burnPair.valueUSD)} on ${burnPair.pair.token0.symbol}/${burnPair.pair.token1.symbol} pair`
    )
  }

  // 1. burnPairs
  // 2. doAction
}
