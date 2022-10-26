import { ChainId } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import log from '@sushiswap/log'
import { getUnixTime, subMonths, subYears } from 'date-fns'
import numeral from 'numeral'

type Arguments = {
  user?: string
}

export async function bar(args: Arguments) {
  // const { getBuiltGraphSDK } = await import('@sushiswap/graph-client/.graphclient')
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
    sdk.CustomBlocks({ timestamp: threeMonthAgo, chainIds: [ChainId.ETHEREUM] }),
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
  log('APR 1m:', numeral((bar?.sushiXsushiRatio / oneMonthBar?.sushiXsushiRatio - 1) * 12).format('0.00%'))
  log('APR 3m:', numeral((bar?.sushiXsushiRatio / threeMonthBar?.sushiXsushiRatio - 1) * 4).format('0.00%'))
  log('APR 6m:', numeral((bar?.sushiXsushiRatio / sixMonthBar?.sushiXsushiRatio - 1) * 2).format('0.00%'))
  log('APR 1y:', numeral(bar?.sushiXsushiRatio / oneYearBar?.sushiXsushiRatio - 1).format('0.00%'))

  // log('Total SUSHI transfered to the bar:')
  // log('Total SUSHI entered the bar:', numeral(bar?.sushiStaked).format('0.00 a'))
  // log('Total SUSHI exited the bar:', numeral(bar?.sushiHarvested).format('0.00 a'))
  // log('Total xSUSHI minted:', numeral(bar?.xSushiMinted).format('0.00 a'))
  // log('Total xSUSHI burned:', numeral(bar?.xSushiBurned).format('0.00 a'))
  // log('Total xSUSHI:', numeral(bar?.totalSupply).format('0.00 a'))
}
