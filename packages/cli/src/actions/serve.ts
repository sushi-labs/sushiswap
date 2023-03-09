import { formatUSD } from '@sushiswap/format'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import chalk from 'chalk'

import { CHAIN_NAME_TO_CHAIN_ID, EXCHANGE_SUBGRAPH_NAME, MAKER_ADDRESS, SUBGRAPH_HOST } from '../config.js'

type Arguments = {
  network?: keyof typeof CHAIN_NAME_TO_CHAIN_ID
  verbose?: boolean
}

export async function serve({ network, verbose }: Arguments) {
  if (!network) {
    throw Error('No network given')
  }

  const chainId = CHAIN_NAME_TO_CHAIN_ID[network]

  const sdk = getBuiltGraphSDK({
    chainId,
    subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
    subgraphHost: SUBGRAPH_HOST[chainId],
  })

  const { liquidityPositions } = await sdk.deprecated_LiquidityPositions({
    first: 5000,
    skip: 0,
    where: { user: MAKER_ADDRESS[chainId] },
  })

  if (!liquidityPositions) {
    console.error(liquidityPositions)
    throw Error("Response didn't have liquidityPositions")
  }

  console.log(chalk.red('Burn, summary'))

  const burnPairs = liquidityPositions
    .map((burnPair) => ({
      ...burnPair,
      valueUSD: (burnPair.liquidityTokenBalance / burnPair.pair.totalSupply) * burnPair.pair.reserveUSD,
    }))
    .filter((burnPair) => burnPair.valueUSD > 1000)
    .sort((a, b) => b.valueUSD - a.valueUSD)

  for (const burnPair of burnPairs) {
    console.log(
      `${chalk.blue(`🔥 ${burnPair.pair.token0.symbol}/${burnPair.pair.token1.symbol}`)} ${chalk.green(
        formatUSD(burnPair.valueUSD)
      )}`
    )
  }

  // 1. burnPairs
  // 2. doAction
}
