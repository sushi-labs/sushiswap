import { addYears, getUnixTime } from 'date-fns'
import numeral from 'numeral'
import Table from 'cli-table3'

import { getBuiltGraphSDK } from '../.graphclient'
import chalk from 'chalk'

type Arguments = {
  all: boolean
}

export async function maker(args: Arguments) {
  const sdk = getBuiltGraphSDK()

  const liquidityPositions = await (await sdk.LiquidityPositions()).ETHEREUM_EXCHANGE_user?.liquidityPositions
  const columns = ['Pair Name', 'Pair Address', 'LP USD Value']

  const rows =
    liquidityPositions?.map((lp) => {
      const pair = lp.pair
      const lpValue = (Number(lp.liquidityTokenBalance) * Number(lp.pair.reserveUSD)) / Number(lp.pair.totalSupply)
      return [`${pair?.token0.symbol}-${pair?.token1.symbol}`, pair?.id, lpValue]
    }).filter(row => row[2] > 20000) ?? []
  const table = new Table({ head: columns, style: { compact: true } })

  rows.forEach((row) => table.push(Object.values(row)))

  console.log(chalk.red('Maker'))
  // console.log(chalk.blue(`Total LP USD Value: $`))
  console.log(table.toString())
}
