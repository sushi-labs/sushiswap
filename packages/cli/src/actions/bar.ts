import { ChainId } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '@sushiswap/graph-client/.graphclient'
import { getCustomBlocks } from '@sushiswap/graph-client/fetchers'
import log from '@sushiswap/log'
import { getUnixTime, subMonths, subYears } from 'date-fns'
import numeral from 'numeral'

type Arguments = {
  user?: string
}

export async function bar(args: Arguments) {
  const sdk = getBuiltGraphSDK({ chainId: ChainId.ETHEREUM })

  const oneMonthAgo = getUnixTime(subMonths(new Date(), 1))
  const threeMonthAgo = getUnixTime(subMonths(new Date(), 3))
  const sixMonthAgo = getUnixTime(subMonths(new Date(), 6))
  const oneYearAgo = getUnixTime(subYears(new Date(), 1))

  const [[oneMonthBlock], [threeMonthBlock], [sixMonthBlock], [oneYearBlock]] = await Promise.all([
    getCustomBlocks([ChainId.ETHEREUM], oneMonthAgo),
    getCustomBlocks([ChainId.ETHEREUM], threeMonthAgo),
    getCustomBlocks([ChainId.ETHEREUM], sixMonthAgo),
    getCustomBlocks([ChainId.ETHEREUM], oneYearAgo),
  ])

  const { xsushi: bar } = await sdk.Bar()

  const [{ xsushi: oneMonthBar }, { xsushi: threeMonthBar }, { xsushi: sixMonthBar }, { xsushi: oneYearBar }] =
    await Promise.all([
      sdk.Bar({ block: oneMonthBlock }),
      sdk.Bar({ block: threeMonthBlock }),
      sdk.Bar({ block: sixMonthBlock }),
      sdk.Bar({ block: oneYearBlock }),
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
