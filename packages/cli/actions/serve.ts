import { formatUSD } from '@sushiswap/format'
import { getBuiltGraphSDK, LiquidityPosition } from '@sushiswap/graph-client'
import { CHAIN_NAME_TO_CHAIN_ID, EXCHANGE_SUBGRAPH_NAME, MAKER_ADDRESS } from 'config'

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

  const { liquidityPositions } = await sdk.LiquidityPositions({ first: 10000, where: { user: MAKER_ADDRESS[chainId] } })

  if (!liquidityPositions) {
    console.error(liquidityPositions)
    throw Error("Response didn't have liquidityPositions")
  }

  console.log('Maker liquidity positons length', liquidityPositions.length)

  // for (const liquidityPosition of res.liquidityPositions) {
  //   const valueUSD =
  //     (liquidityPosition.liquidityTokenBalance / liquidityPosition.pair.totalSupply) * liquidityPosition.pair.reserveUSD

  //   if (valueUSD > 1000) {
  //     console.log(
  //       `🔥 BURN: ${formatUSD(valueUSD)} on ${liquidityPosition.pair.token0.symbol}/${
  //         liquidityPosition.pair.token1.symbol
  //       } pair`
  //     )
  //   } else {
  //     console.log(
  //       `🚩 DONT BURN: ${formatUSD(valueUSD)} on ${liquidityPosition.pair.token0.symbol}/${
  //         liquidityPosition.pair.token1.symbol
  //       } pair`
  //     )
  //   }
  // }

  const burnPairs = liquidityPositions.filter(
    (liquidityPosition: LiquidityPosition) =>
      (liquidityPosition.liquidityTokenBalance / liquidityPosition.pair.totalSupply) *
        liquidityPosition.pair.reserveUSD >
      1000
  )

  for (const burPair of burnPairs) {
    const valueUSD = (burPair.liquidityTokenBalance / burPair.pair.totalSupply) * burPair.pair.reserveUSD
    console.log(`🔥 BURN: ${formatUSD(valueUSD)} on ${burPair.pair.token0.symbol}/${burPair.pair.token1.symbol} pair`)
  }

  // 1. burnPairs
  // 2. doAction
}
