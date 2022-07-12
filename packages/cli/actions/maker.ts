import { ChainKey } from '@sushiswap/chain'
import { LiquidityPosition, Pair, Token } from '@sushiswap/graph-client'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import chalk from 'chalk'
import Table from 'cli-table3'
import numeral from 'numeral'

import {
  CHAIN_NAME_TO_CHAIN_ID,
  EXCHANGE_SUBGRAPH_NAME,
  MAKER_ADDRESS,
  MAKER_SUPPORTED_CHAIN_NAMES,
  MAKER_TYPE,
} from '../config'

type LiquidityPositons = Array<
  Pick<LiquidityPosition, 'liquidityTokenBalance'> & {
    pair: Pick<Pair, 'id' | 'totalSupply' | 'reserveUSD'> & {
      token0: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
      token1: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
    }
  }
>

type Arguments = {
  network?: string
  verbose?: boolean
}

interface row {
  pair: string
  pairId: string
  lpUsdValue: number
}

export async function maker(args: Arguments) {
  if (args.network) {
    const network = Object.values(ChainKey).find((networkName) => networkName === args.network?.toLowerCase())
    console.log('network selected: ', network)

    if (!network || !MAKER_SUPPORTED_CHAIN_NAMES.includes(network)) {
      throw new Error('Unsupported chain. Supported chains are: '.concat(MAKER_SUPPORTED_CHAIN_NAMES.join(', ')))
    }

    const sdk = await getBuiltGraphSDK({
      chainId: CHAIN_NAME_TO_CHAIN_ID[network],
      subgraphName: EXCHANGE_SUBGRAPH_NAME[CHAIN_NAME_TO_CHAIN_ID[network]],
    })

    const liquidityPositions = Object.values(await sdk.User({ id: MAKER_ADDRESS[network] }))[0]?.liquidityPositions

    if (network && liquidityPositions) {
      printMakerTable(network, liquidityPositions)
    } else {
      console.log('network or subgraph response was empty')
    }
  } else {
    console.log(
      MAKER_SUPPORTED_CHAIN_NAMES.map((chain) => ({
        chain,
        chainId: CHAIN_NAME_TO_CHAIN_ID[chain],
        subgraphName: EXCHANGE_SUBGRAPH_NAME[CHAIN_NAME_TO_CHAIN_ID[chain]],
      }))
    )

    const makers = await Promise.all(
      MAKER_SUPPORTED_CHAIN_NAMES.map((chain) =>
        Promise.resolve(
          getBuiltGraphSDK({
            chainId: CHAIN_NAME_TO_CHAIN_ID[chain],
            subgraphName: EXCHANGE_SUBGRAPH_NAME[CHAIN_NAME_TO_CHAIN_ID[chain]],
          })
            .User({ id: MAKER_ADDRESS[chain] })
            .then((result) => ({
              network: chain,
              address: MAKER_ADDRESS[chain],
              type: MAKER_TYPE[chain],
              liquidityPositions: result,
            }))
        )
      )
    )

    // console.log({ makers })

    const columns = ['Network', 'Maker address', 'type/owner', 'LP USD value']
    let totalValue = 0
    const rows =
      makers?.map((lp) => {
        const network = lp.network.toString()
        const makerAddress = lp.address
        const type = lp.type
        const liquidityPositions = Object.values(lp.liquidityPositions)[0]?.liquidityPositions
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
}

function printMakerTable(network: string, liquidityPositions: LiquidityPositons) {
  const columns = ['Pair Name', 'Pair Address', 'LP USD Value']

  const rows =
    liquidityPositions
      ?.map((lp) => {
        const pair = lp.pair
        const lpUsdValue = Number(lp.pair.totalSupply)
          ? (Number(lp.liquidityTokenBalance) / Number(lp.pair.totalSupply)) * Number(lp.pair.reserveUSD)
          : 0
        return {
          pair: `${pair?.token0.symbol}-${pair?.token1.symbol}`,
          pairId: pair?.id,
          lpUsdValue,
        } as row
      })
      .sort((a, b) => (a.lpUsdValue > b.lpUsdValue ? -1 : 1))
      .map((row) => ({ pair: row.pair, pairId: row.pairId, lpUsdValue: numeral(row.lpUsdValue).format('$0.00a') })) ??
    []

  const table = new Table({ head: columns, style: { compact: true } })

  rows.forEach((row) => table.push(Object.values(row)))

  console.log(chalk.red(`Maker, network: ${network}`))
  console.log(table.toString())
}
