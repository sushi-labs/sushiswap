import { chainName } from '@sushiswap/chain'
import { deprecated_LiquidityPositionsQuery, getBuiltGraphSDK } from '@sushiswap/graph-client'
import { isPromiseFulfilled } from '@sushiswap/validate'
import chalk from 'chalk'
import Table from 'cli-table3'
import numeral from 'numeral'

import {
  CHAIN_NAME_TO_CHAIN_ID,
  EXCHANGE_SUBGRAPH_NAME,
  MAKER_ADDRESS,
  MAKER_SUPPORTED_CHAIN_NAMES,
  MAKER_TYPE,
  SUBGRAPH_HOST,
} from '../config.js'

type Arguments = {
  network?: (typeof MAKER_SUPPORTED_CHAIN_NAMES)[number]
  verbose?: boolean
}

export async function maker(args: Arguments) {
  const { default: ora } = await import('ora')

  const throbber = ora({
    text: `Loading Sushi Maker liquidity positions for chain ids ${MAKER_SUPPORTED_CHAIN_NAMES.join(', ')}\n`,
    spinner: {
      frames: ['🍱', '🥠', '🍣', '🥢', '🍙'],
      interval: 300,
    },
  })
  throbber.start()

  const results = await Promise.allSettled(
    MAKER_SUPPORTED_CHAIN_NAMES.map((chainName) => {
      const chainId = CHAIN_NAME_TO_CHAIN_ID[chainName]
      const sdk = getBuiltGraphSDK({
        chainId,
        chainName,
        subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
        subgraphHost: SUBGRAPH_HOST[chainId],
      })

      return sdk
        .deprecated_LiquidityPositions({
          first: 5000,
          skip: 0,
          where: { user: MAKER_ADDRESS[chainId].toLowerCase() },
        })
        .then(({ liquidityPositions }) => {
          if (!Array.isArray(liquidityPositions) || !liquidityPositions.length) {
            throbber.warn(`We were unable to find any liquidity positions for ${chainName}:${MAKER_ADDRESS[chainId]}`)
          }
          throbber.succeed(
            `Found ${liquidityPositions.length} liquidity positions for ${chainName}:${MAKER_ADDRESS[chainId]}`
          )
          return {
            chainId,
            liquidityPositions,
          }
        })
    })
  ).then((promiseSettledResults) =>
    promiseSettledResults
      .flat()
      .filter(isPromiseFulfilled)
      .map((promiseFulfilled) => promiseFulfilled.value)
  )

  throbber.stopAndPersist({
    symbol: '🍽️ ',
    text: `Found ${results.reduce(
      (a, { liquidityPositions }) => a + liquidityPositions.length,
      0
    )} liquidity positions for Sushi Maker across ${MAKER_SUPPORTED_CHAIN_NAMES.join(', ')} chains`,
  })

  const columns = ['Network', 'Maker address', 'type/owner', 'LP USD value']
  let totalValue = 0
  const rows =
    results?.map(({ chainId, liquidityPositions }) => {
      const network = chainName[chainId]
      const makerAddress = MAKER_ADDRESS[chainId]
      const type = MAKER_TYPE[chainId]

      console.log([chainId, MAKER_ADDRESS[chainId], MAKER_TYPE[chainId]])

      const lpValue = liquidityPositions?.map((lp) =>
        Number(lp.pair.totalSupply)
          ? (Number(lp.liquidityTokenBalance) / Number(lp.pair.totalSupply)) * Number(lp.pair.reserveUSD)
          : 0
      )
      const summedLp = lpValue?.reduce((acc, curr) => acc + curr)
      totalValue += summedLp ?? 0

      if (network && liquidityPositions && args.verbose) {
        printMakerTable(network, liquidityPositions)
      }

      return {
        network,
        makerAddress,
        type,
        summedLp: numeral(summedLp).format('$0.00a'),
      }
    }) ?? []

  const table = new Table({ head: columns, style: { compact: true } })

  rows.forEach((row) => table.push(Object.values(row)))

  console.log(chalk.red('Maker, summary'))
  console.log(table.toString())
  console.log(`Total value: ` + chalk.green(`${numeral(totalValue).format('$0.00a')}`))
}

function printMakerTable(
  network: string,
  liquidityPositions: deprecated_LiquidityPositionsQuery['liquidityPositions']
) {
  const columns = ['Pair Name', 'Pair Address', 'LP USD Value']

  const rows =
    liquidityPositions
      ?.map((lp) => {
        const pair = lp.pair
        const lpUsdValue = Number(lp.pair.totalSupply)
          ? (Number(lp.liquidityTokenBalance) / Number(lp.pair.totalSupply)) * Number(lp.pair.reserveUSD)
          : 0
        return {
          pair: `${pair.token0.symbol}-${pair.token1.symbol}`,
          pairId: pair.id,
          lpUsdValue,
        } as const
      })
      .sort((a, b) => (a.lpUsdValue > b.lpUsdValue ? -1 : 1))
      .map((row) => ({
        pair: row.pair,
        pairId: row.pairId,
        lpUsdValue: numeral(row.lpUsdValue).format('$0.00a'),
      })) ?? []

  const table = new Table({ head: columns, style: { compact: true } })

  rows.forEach((row) => table.push(Object.values(row)))

  console.log(chalk.red(`Maker, network: ${network}`))
  console.log(table.toString())
}
