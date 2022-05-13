import { addYears, getUnixTime } from 'date-fns'
import numeral from 'numeral'
import Table from 'cli-table3'

import { getBuiltGraphSDK } from '../.graphclient'
import chalk from 'chalk'
import { el } from 'date-fns/locale'
import { getMakerLPs } from '../graph/graph-client'
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
            lpUsdValue,
          } as row
        })
        .sort((a, b) => (a.lpUsdValue > b.lpUsdValue ? -1 : 1)) ?? []

    const table = new Table({ head: columns, style: { compact: true } })

    rows.forEach((row) => table.push(Object.values(row)))

    console.log(chalk.red('Maker'))
    // console.log(chalk.blue(`Total LP USD Value: $`))
    console.log(table.toString())
  } else {
    console.log('fetch sum up lp value across all networks')
  }
}
