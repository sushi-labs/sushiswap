import { ChainId, ChainKey } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import chalk from 'chalk'
import CliTable3 from 'cli-table3'
import fetch from 'node-fetch'

import { FURO_SUPPORTED_CHAIN_NAMES, REVENUES_SUPPORTED_CHAIN_NAMES } from '../config.js'

type Arguments = {
  network?: (typeof REVENUES_SUPPORTED_CHAIN_NAMES)[number]
}
export async function furo(args: Arguments) {
  const sdk = getBuiltGraphSDK()

  if (args.network) {
    if (!ChainId[args.network.toUpperCase() as any]) {
      console.log(chalk.red(`Please provide a valid network: ${REVENUES_SUPPORTED_CHAIN_NAMES.join(', ')}.`))
      return
    } else {
      console.log(chalk.green(`Querying Furo TVL for ${args.network}...`))
    }
  } else {
    console.log(chalk.green('Querying FURO TVL for all networks...'))
  }

  const chainIds = args.network
    ? [Number(ChainId[args.network.toUpperCase() as any])]
    : FURO_SUPPORTED_CHAIN_NAMES.map((chainId) => {
        return Number(ChainId[chainId.toUpperCase() as any])
      })

  const tokens = (
    await sdk.furoTokensByChainIds({
      chainIds: chainIds,
      where: { liquidityShares_gt: 0 },
    })
  ).tokens

  const tokenAddresses: string[] = []
  tokens.map((token) => {
    tokenAddresses.push(token.id)
  })

  const rebasesArray = (
    await sdk.RebasesByChainIds({
      chainIds: chainIds,
      where: { token_in: tokenAddresses },
    })
  ).rebases
  const rebases: { [id: string]: number } = {}
  rebasesArray.map((rebase) => {
    rebases[rebase.id] = Number(rebase.elastic) / Number(rebase.base)
  })

  const tokensDefillamaPriceQuery = tokens.map((token) => {
    if (ChainId[token.chainId].toLowerCase() === ChainKey[ChainId.AVALANCHE]) {
      return `avax:${token.id}`
    }
    return `${ChainId[token.chainId].toLowerCase()}:${token.id}`
  })
  const symbolToPrice: { [symbol: string]: number } = {}
  await fetch(`https://coins.llama.fi/prices/current/${tokensDefillamaPriceQuery.join(',')}`).then((data: any) =>
    data.json().then((data) => {
      Object.values(data.coins).map((token: any) => {
        symbolToPrice[token.symbol] = token.price
      })
    })
  )

  let totalTvl = 0
  const tokensTVL = tokens
    .map((token) => {
      const tokenAmount = (Number(token.liquidityShares) / 10 ** Number(token.decimals)) * rebases[token.id]
      const tokenTVL = tokenAmount * symbolToPrice[token.symbol]
      if (!isNaN(tokenTVL)) {
        totalTvl += tokenTVL
      }
      return {
        chain: ChainId[token.chainId],
        symbol: token.symbol,
        tvl: tokenTVL,
      }
    })
    .filter((token) => !isNaN(token.tvl) && token.tvl > 1) //don't show if less than 1$
    .sort((tokenA, tokenB) => {
      return tokenA.tvl < tokenB.tvl ? 1 : -1
    })

  const table = new CliTable3({
    head: [chalk.white('Chain'), chalk.white('Symbol'), chalk.white('TVL')],
    colWidths: [20, 20, 20],
  })
  table.push([
    chalk.green('TOTAL'),
    chalk.green('-'),
    chalk.green(`${totalTvl.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} $`),
  ])
  for (const token of tokensTVL) {
    table.push([token.chain, token.symbol, `${token.tvl.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} $`])
  }

  console.log(table.toString())
}
