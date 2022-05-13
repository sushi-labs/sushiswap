import { addYears, getUnixTime } from 'date-fns'
import numeral from 'numeral'
import Table from 'cli-table3'

import { getBuiltGraphSDK } from '../.graphclient'
import chalk from 'chalk'
import { el } from 'date-fns/locale'
import { getAllMakers, getMakerLPs } from '../graph/graph-client'
import { ChainId, ChainKey } from '@sushiswap/chain'

type Arguments = {
  network?: string
}

interface row {
  pair: string
  pairId: string
  lpUsdValue: number
}

export async function maker(args: Arguments) {
  const sdk = getBuiltGraphSDK()

  if (args.network) {
    const network = Object.values(ChainKey).find((networkName) => networkName === args.network?.toLowerCase())
    console.log('network selected: ', network)
    const liquidityPositions = await getMakerLPs(network)
    const columns = ['Pair Name', 'Pair Address', 'LP USD Value']

    const rows =
      liquidityPositions
        ?.map((lp) => {
          const pair = lp.pair
          const lpUsdValue =
            (Number(lp.liquidityTokenBalance) * Number(lp.pair.reserveUSD)) / Number(lp.pair.totalSupply)
          return {
            pair: `${pair?.token0.symbol}-${pair?.token1.symbol}`,
            pairId: pair?.id,
            lpUsdValue: lpUsdValue,
          } as row
        })
        .sort((a, b) => (a.lpUsdValue > b.lpUsdValue ? -1 : 1))
        .map((row) => ({ pair: row.pair, pairId: row.pairId, lpUsdValue: numeral(row.lpUsdValue).format('$0.00a') })) ??
      []

    const table = new Table({ head: columns, style: { compact: true } })

    rows.forEach((row) => table.push(Object.values(row)))

    console.log(chalk.red('Maker'))
    console.log(table.toString())
  } else {
    console.log('fetch sum up lp value across all networks')
    const liquidityPositions = await getAllMakers()
    const columns = ['Network', 'Maker address', 'type/owner', 'LP USD value']

    const rows =
      liquidityPositions?.map((lp) => {
        const network = lp.network.toString()
        const makerAddress = lp.address
        const type = lp.type
        const lpValues = lp.liquidityPositions?.map(
          (lp) => (Number(lp.liquidityTokenBalance) * Number(lp.pair.reserveUSD)) / Number(lp.pair.totalSupply),
        )
        const summedLp = lpValues?.reduce((acc, curr) => acc + curr)
        return {
          network,
          makerAddress,
          type,
          summedLp: numeral(summedLp).format('$0.00a'),
        }
      }) ?? []

    const table = new Table({ head: columns, style: { compact: true } })

    rows.forEach((row) => table.push(Object.values(row)))

    console.log(chalk.red('Maker'))
    console.log(table.toString())
  }
}
