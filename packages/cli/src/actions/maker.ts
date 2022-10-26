import { ChainKey } from '@sushiswap/chain'
import {
  EXCHANGE_LiquidityPosition,
  EXCHANGE_Pair,
  EXCHANGE_Token,
  getBuiltGraphSDK,
} from '@sushiswap/graph-client/.graphclient'
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
  Pick<EXCHANGE_LiquidityPosition, 'liquidityTokenBalance'> & {
    pair: Pick<EXCHANGE_Pair, 'id' | 'totalSupply' | 'reserveUSD'> & {
      token0: Pick<EXCHANGE_Token, 'id' | 'symbol' | 'name' | 'decimals'>
      token1: Pick<EXCHANGE_Token, 'id' | 'symbol' | 'name' | 'decimals'>
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

    const chainId = CHAIN_NAME_TO_CHAIN_ID[network]

    const sdk = getBuiltGraphSDK({
      chainId,
      subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
    })

    // const liquidityPositions = Object.values(await sdk.User({ id: MAKER_ADDRESS[chainId] }))[0]?.liquidityPositions

    const { liquidityPositions } = await sdk.ExchangeLiquidityPositions({
      first: 25000,
      where: { user: MAKER_ADDRESS[chainId] },
    })

    if (network && liquidityPositions) {
      printMakerTable(network, liquidityPositions)
    } else {
      console.log('network or subgraph response was empty')
    }
  } else {
    // const makers = []

    const { default: ora } = await import('ora')

    const throbber = ora({
      text: `Searching maker liquidity positions for ${MAKER_SUPPORTED_CHAIN_NAMES.join(', ')}`,
      spinner: {
        frames: ['🍱', '🥠', '🍣', '🥢', '🍙'],
        interval: 300,
      },
    }).start()

    const promises = MAKER_SUPPORTED_CHAIN_NAMES.map((chainName) => {
      const chainId = CHAIN_NAME_TO_CHAIN_ID[chainName]
      const sdk = getBuiltGraphSDK({
        chainId,
        subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
      })
      return sdk
        .ExchangeLiquidityPositions({
          first: 25000,
          where: { user: MAKER_ADDRESS[chainId] },
        })
        .then(({ liquidityPositions }) => ({
          network: chainName,
          address: MAKER_ADDRESS[chainId],
          type: MAKER_TYPE[chainId],
          liquidityPositions,
        }))
    })

    const makers = await Promise.all(promises).then((data) => data.flat())

    console.log({ makers })

    const liquidityPositions = makers.reduce<EXCHANGE_LiquidityPosition[]>((previousValue, currentValue) => {
      return [...previousValue, ...currentValue.liquidityPositions]
    }, [])

    throbber.stopAndPersist({
      symbol: '🍽️ ',
      text: `Found ${
        liquidityPositions.length
      } liquidity positions for Sushi Maker across ${MAKER_SUPPORTED_CHAIN_NAMES.join(', ')} chains`,
    })

    // for (const chainName of MAKER_SUPPORTED_CHAIN_NAMES) {
    //   const chainId = CHAIN_NAME_TO_CHAIN_ID[chainName]
    //   const sdk = getBuiltGraphSDK({
    //     chainId,
    //     subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
    //   })
    //   // throbber.info(`Searching maker liquidity positions for ${chainName}`)

    //   const { default: ora } = await import('ora')

    //   const throbber = ora({
    //     text: `Searching maker liquidity positions for ${chainName}`,
    //     spinner: {
    //       frames: ['🍱', '🥠', '🍣', '🥢', '🍙'],
    //       interval: 300,
    //     },
    //   }).start()

    //   const liquidityPositions = await sdk
    //     .ExchangeLiquidityPositions({
    //       first: 25000,
    //       where: { user: MAKER_ADDRESS[chainId] },
    //     })
    //     .then(({ liquidityPositions }) => liquidityPositions ?? [])

    //   if (liquidityPositions) {
    //     throbber.stopAndPersist({
    //       symbol: '🍽️ ',
    //       text: `Found ${liquidityPositions.length} maker liquidity positions for ${chainName}, set size is ${
    //         new Set(liquidityPositions.map((liquidityPosition) => liquidityPosition.id)).size
    //       }`,
    //     })
    //     makers.push({
    //       network: chainName,
    //       address: MAKER_ADDRESS[chainId],
    //       type: MAKER_TYPE[chainId],
    //       liquidityPositions,
    //     })
    //   } else {
    //     throbber.stopAndPersist({
    //       symbol: '❌ ',
    //       text: 'Liquidity Positons is undefined',
    //     })
    //   }
    // }

    const columns = ['Network', 'Maker address', 'type/owner', 'LP USD value']
    let totalValue = 0
    const rows =
      makers?.map((lp) => {
        const network = lp.network
        const makerAddress = lp.address
        const type = lp.type
        const lpValue = lp.liquidityPositions?.map((lp) =>
          Number(lp.pair.totalSupply)
            ? (Number(lp.liquidityTokenBalance) / Number(lp.pair.totalSupply)) * Number(lp.pair.reserveUSD)
            : 0
        )
        const summedLp = lpValue?.reduce((acc, curr) => acc + curr)
        totalValue += summedLp ?? 0

        if (network && lp.liquidityPositions && args.verbose) {
          printMakerTable(network, lp.liquidityPositions)
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
