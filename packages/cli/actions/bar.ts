import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import log from '@sushiswap/log'
import { getUnixTime, subMonths, subYears } from 'date-fns'
import numeral from 'numeral'

export async function bar() {
  const sdk = getBuiltGraphSDK()

  const oneMonthAgo = getUnixTime(subMonths(new Date(), 1))
  const threeMonthAgo = getUnixTime(subMonths(new Date(), 3))
  const sixMonthAgo = getUnixTime(subMonths(new Date(), 6))
  const oneYearAgo = getUnixTime(subYears(new Date(), 1))

  const [
    {
      ETHEREUM_BLOCKS_blocks: [oneYearBlock],
    },
    {
      ETHEREUM_BLOCKS_blocks: [oneMonthBlock],
    },
    {
      ETHEREUM_BLOCKS_blocks: [threeMonthBlock],
    },
    {
      ETHEREUM_BLOCKS_blocks: [sixMonthBlock],
    },
  ] = await Promise.all([
    sdk.EthereumBlocks({ where: { timestamp_gt: oneYearAgo, timestamp_lt: oneYearAgo + 30000 } }),
    sdk.EthereumBlocks({ where: { timestamp_gt: oneMonthAgo, timestamp_lt: oneMonthAgo + 30000 } }),
    sdk.EthereumBlocks({ where: { timestamp_gt: threeMonthAgo, timestamp_lt: threeMonthAgo + 30000 } }),
    sdk.EthereumBlocks({ where: { timestamp_gt: sixMonthAgo, timestamp_lt: sixMonthAgo + 30000 } }),
  ])

  const { bar } = await sdk.Bar()

  const [{ bar: oneYearBar }, { bar: oneMonthBar }, { bar: threeMonthBar }, { bar: sixMonthBar }] = await Promise.all([
    sdk.Bar({ block: { number: Number(oneYearBlock.number) } }),
    sdk.Bar({ block: { number: Number(oneMonthBlock.number) } }),
    sdk.Bar({ block: { number: Number(threeMonthBlock.number) } }),
    sdk.Bar({ block: { number: Number(sixMonthBlock.number) } }),
  ])

  // Lukas Witpeerd, [02/05/2022 19:23] ((current ratio / ratio 365 days ago) - 1) * 100
  log('APR 1y:', numeral(bar?.ratio / oneYearBar?.ratio - 1).format('0.00%'))
  log('APR 6m:', numeral((bar?.ratio / sixMonthBar?.ratio - 1) * 2).format('0.00%'))
  log('APR 3m:', numeral((bar?.ratio / threeMonthBar?.ratio - 1) * 4).format('0.00%'))
  log('APR 1m:', numeral((bar?.ratio / oneMonthBar?.ratio - 1) * 12).format('0.00%'))

  // log('Total SUSHI transfered to the bar:')
  // log('Total SUSHI entered the bar:', numeral(bar?.sushiStaked).format('0.00 a'))
  // log('Total SUSHI exited the bar:', numeral(bar?.sushiHarvested).format('0.00 a'))
  // log('Total xSUSHI minted:', numeral(bar?.xSushiMinted).format('0.00 a'))
  // log('Total xSUSHI burned:', numeral(bar?.xSushiBurned).format('0.00 a'))
  // log('Total xSUSHI:', numeral(bar?.totalSupply).format('0.00 a'))
}
