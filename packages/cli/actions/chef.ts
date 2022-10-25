import { ChainId } from '@sushiswap/chain'
import { SUSHI_ADDRESS } from '@sushiswap/currency'
import { getBuiltGraphSDK } from '@sushiswap/graph-client/.graphclient'
import chalk from 'chalk'
import Table from 'cli-table3'
import { addYears, getUnixTime } from 'date-fns'
import numeral from 'numeral'

const secondsPerBlock = 13.4

type Arguments = {
  version: '1' | '2'
  all: boolean
}

export async function chef(args: Arguments) {
  const sdk = getBuiltGraphSDK()

  const { MASTERCHEF_V1_pools, MASTERCHEF_V2_pools } = await sdk.MasterChefPools()

  const { pairs } = await sdk.ExchangePairs({
    where: {
      id_in: [...MASTERCHEF_V1_pools, ...MASTERCHEF_V2_pools].reduce<string[]>(
        (previousValue, currentValue) => [...previousValue, currentValue.pair],
        []
      ),
    },
  })

  const sushiPriceUSD = await (async function () {
    {
      const prices = await fetch('https://token-price.sushi.com/v0/1').then((data) => data.json())
      return prices[SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase()]
    }
  })()

  const digestPools = (pools: typeof MASTERCHEF_V1_pools, sushiPerBlock: number) =>
    pools
      .filter(
        (pool) =>
          (!args.all && pool.allocPoint !== '0' && pairs.find((pair) => pair.id === pool.pair)) ||
          (args.all && pairs.find((pair) => pair.id === pool.pair))
      )
      .map((pool) => {
        const pair = pairs.find((pair) => pair.id === pool.pair)
        const tvl = ((pair?.reserveUSD / pair?.totalSupply) * pool.slpBalance) / 1e18
        const sushiPerSecond = ((pool.allocPoint / pool.masterChef.totalAllocPoint) * sushiPerBlock) / secondsPerBlock
        const apr = (getUnixTime(addYears(0, 1)) * sushiPerSecond * sushiPriceUSD) / tvl
        return {
          Index: pool.id,
          'Pair Name': `${pair?.token0.symbol}-${pair?.token1.symbol}`,
          'Pair Address': pair?.id,
          'Farm TVL': numeral(tvl).format('$0.00a'),
          APs: pool.allocPoint,
          'Sushi/s': sushiPerSecond.toFixed(6),
          APR: numeral(apr).format('0.00 %'),
        }
      })
      .sort((a, b) => Number(a?.Index) - Number(b?.Index))

  const digestedV1 = digestPools(MASTERCHEF_V1_pools, 100)
  if (digestedV1.length > 0) {
    const table = new Table({ head: Object.keys(digestedV1[0]), style: { compact: true } })
    digestedV1.forEach((pool) => table.push(Object.values(pool)))
    console.log(chalk.red('MasterChef V1'))
    console.log(chalk.blue(`Total Alloc Points: ${MASTERCHEF_V1_pools[0].masterChef.totalAllocPoint}`))
    console.log(table.toString())
  }

  const digestedV2 = digestPools(
    MASTERCHEF_V2_pools,
    (MASTERCHEF_V2_pools[0].masterChef.totalAllocPoint / MASTERCHEF_V1_pools[0].masterChef.totalAllocPoint) * 100
  )
  if (digestedV2.length > 0) {
    const table = new Table({ head: Object.keys(digestedV2[0]), style: { compact: true } })
    digestedV2.forEach((pool) => table.push(Object.values(pool)))
    console.log(chalk.red('MasterChef V2'))
    console.log(chalk.blue(`Total Alloc Points: ${MASTERCHEF_V2_pools[0].masterChef.totalAllocPoint}`))
    console.log(table.toString())
  }
}
