import { ChainId } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import chalk from 'chalk'
import CliTable3 from 'cli-table3'
import { getUnixTime, subMonths, subYears } from 'date-fns'
import numeral from 'numeral'

type Arguments = {
  user?: string
}

export async function bar(args: Arguments) {
  // const { getBuiltGraphSDK } = await import('@sushiswap/graph-client')
  const sdk = getBuiltGraphSDK({ chainId: ChainId.ETHEREUM })

  const oneMonthAgo = getUnixTime(subMonths(new Date(), 1))
  const threeMonthAgo = getUnixTime(subMonths(new Date(), 3))
  const sixMonthAgo = getUnixTime(subMonths(new Date(), 6))
  const oneYearAgo = getUnixTime(subYears(new Date(), 1))

  const [
    {
      customBlocks: [oneMonthBlock],
    },
    {
      customBlocks: [threeMonthBlock],
    },
    {
      customBlocks: [sixMonthBlock],
    },
    {
      customBlocks: [oneYearBlock],
    },
  ] = await Promise.all([
    sdk.CustomBlocks({ timestamp: oneMonthAgo, chainIds: [ChainId.ETHEREUM] }),
    sdk.CustomBlocks({
      timestamp: threeMonthAgo,
      chainIds: [ChainId.ETHEREUM],
    }),
    sdk.CustomBlocks({ timestamp: sixMonthAgo, chainIds: [ChainId.ETHEREUM] }),
    sdk.CustomBlocks({ timestamp: oneYearAgo, chainIds: [ChainId.ETHEREUM] }),
  ])

  const { xsushi: bar } = await sdk.Bar()

  const [{ xsushi: oneMonthBar }, { xsushi: threeMonthBar }, { xsushi: sixMonthBar }, { xsushi: oneYearBar }] =
    await Promise.all([
      sdk.Bar({ block: { number: Number(oneMonthBlock.number) } }),
      sdk.Bar({ block: { number: Number(threeMonthBlock.number) } }),
      sdk.Bar({ block: { number: Number(sixMonthBlock.number) } }),
      sdk.Bar({ block: { number: Number(oneYearBlock.number) } }),
    ])

  // Lukas Witpeerd, [02/05/2022 19:23] ((current ratio / ratio 365 days ago) - 1) * 100
  console.log(chalk.red('xSUSHI, summary'))

  const table = new CliTable3({
    // style: {
    //   'padding-left': 0,
    //   'padding-right': 0,
    //   head: [],
    //   border: [],
    // },
  })

  table.push([
    chalk.blue('APR 1m'),
    chalk.bold.green(numeral((bar?.sushiXsushiRatio / oneMonthBar?.sushiXsushiRatio - 1) * 12).format('0.00%')),
    // chalk.green(numeral((bar?.sushiXsushiRatio / oneMonthBar?.sushiXsushiRatio - 1) * 12).format('0.00%')),
  ])

  table.push([
    chalk.blue('APR 3m'),
    chalk.bold.green(numeral((bar?.sushiXsushiRatio / threeMonthBar?.sushiXsushiRatio - 1) * 4).format('0.00%')),
    // chalk.green(numeral((bar?.sushiXsushiRatio / threeMonthBar?.sushiXsushiRatio - 1) * 4).format('0.00%')),
  ])

  table.push([
    chalk.blue('APR 6m'),
    chalk.bold.green(numeral((bar?.sushiXsushiRatio / sixMonthBar?.sushiXsushiRatio - 1) * 2).format('0.00%')),
    // chalk.green(numeral((bar?.sushiXsushiRatio / sixMonthBar?.sushiXsushiRatio - 1) * 2).format('0.00%')),
  ])

  table.push([
    chalk.blue('APR 1y'),
    chalk.bold.green(numeral(bar?.sushiXsushiRatio / oneYearBar?.sushiXsushiRatio - 1).format('0.00%')),
    // chalk.green(numeral(bar?.sushiXsushiRatio / oneYearBar?.sushiXsushiRatio - 1).format('0.00%')),
  ])

  console.log(table.toString())
}
