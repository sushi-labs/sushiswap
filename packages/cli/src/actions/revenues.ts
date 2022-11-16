import { ChainId, chainName } from '@sushiswap/chain'
import { SUSHI_ADDRESS } from '@sushiswap/currency'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import chalk from 'chalk'
import cliProgress from 'cli-progress'
import CliTable3 from 'cli-table3'

import { REVENUES_SUPPORTED_CHAIN_NAMES } from '../config'

const sdk = getBuiltGraphSDK()

type Arguments = {
  network?: typeof REVENUES_SUPPORTED_CHAIN_NAMES[number]
  days?: string
}

export async function revenues(args: Arguments) {
  const days = args.days ? Number(args.days) : 1

  if (days < 1 || days > 30) {
    console.log(chalk.red('Please provide a valid amount of day between 1 and 30.'))
    return
  }
  if (args.network) {
    if (!ChainId[args.network.toUpperCase() as any]) {
      console.log(chalk.red('Please provide a valid network: ' + REVENUES_SUPPORTED_CHAIN_NAMES.join(', ') + '.'))
      return
    } else {
      console.log(chalk.green('Querying revenues for ' + args.network + ' during the last ' + days + ' day(s)...'))
    }
  } else {
    console.log(chalk.green('Querying revenues for all networks during the last ' + days + ' day(s)...'))
  }

  const chainIds = args.network
    ? [parseInt(ChainId[args.network.toUpperCase() as any])]
    : REVENUES_SUPPORTED_CHAIN_NAMES.map((name) => {
        return parseInt(ChainId[name.toUpperCase() as any])
      })

  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
  progressBar.start(chainIds.length, 0, { speed: 'N/A' })

  const sushiPriceUSD = await (async function () {
    {
      const prices = await fetch('https://token-price.sushi.com/v0/1').then((data) => data.json())
      return prices[SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase()]
    }
  })()

  const lastBlocks = await getBlockByTimestamp(chainIds, 0) //lastest block
  const pastBlocks = await getBlockByTimestamp(chainIds, days) //block x days ago

  const revenues: {
    [chainName: string]: {
      revenue: number
      spent: number
    }
  } = {
    Total: { revenue: 0, spent: 0 },
  }
  await Promise.all(
    lastBlocks.map(async (block) => {
      const lastPairs = await getAllPairsWithFarms([block.chainId], Number(block.number))

      const pastPairs = await getAllPairsWithFarms(
        [block.chainId],
        Number(pastBlocks.find((b) => b.chainId === block.chainId)?.number)
      )

      for (const pair of lastPairs) {
        if (!revenues[chainName[pair.chainId]]) {
          revenues[chainName[pair.chainId]] = { revenue: 0, spent: 0 }
        }
        if (pair.farm) {
          const sushiIncentive = pair.farm.incentives.find((incentive) => {
            return incentive.rewardToken.address.toLowerCase() == SUSHI_ADDRESS[pair.chainId].toLowerCase()
          })
          if (sushiIncentive) {
            const spent1d = sushiIncentive.rewardPerDay * sushiPriceUSD
            revenues[chainName[pair.chainId]].spent += spent1d * days
            revenues['Total'].spent += spent1d * days
          }
        }
        const previousFees = pastPairs.find((p) => p.id === pair.id)?.feesUSD
        const revenue = previousFees ? pair.feesUSD - previousFees : pair.feesUSD
        revenues[chainName[pair.chainId]].revenue += revenue / 6
        revenues['Total'].revenue += revenue / 6
      }
      progressBar.increment()
    })
  )

  const orderedRevenues = Object.entries(revenues).sort((a, b) => {
    return a[1].revenue > b[1].revenue ? -1 : 1
  })

  const table = new CliTable3({
    head: [
      chalk.white('Chain'),
      chalk.white(days + ' day(s) revenues'),
      chalk.white(days + ' day(s) sushi spent'),
      chalk.white(days + ' day(s) benefits'),
    ],
    colWidths: [40, 30, 30, 30],
  })

  for (const revenue of orderedRevenues) {
    const benefits = revenue[1].revenue - revenue[1].spent
    const benefitsString = benefits.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $'
    table.push([
      revenue[0],
      revenue[1].revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $',
      revenue[1].spent.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $',
      benefits > 0 ? chalk.green(benefitsString) : chalk.red(benefitsString),
    ])
  }

  progressBar.stop()
  console.log(table.toString())
}

async function getBlockByTimestamp(chainIds: number[], days: number) {
  const daysInSecond = days * 3600 * 24
  return (
    await sdk.BlocksByChainIds({
      chainIds: chainIds,
      where: {
        //latest block between 5 to 10 minutes with the timestamp given
        timestamp_gt: Math.floor(Date.now() / 1000) - daysInSecond - 600,
        timestamp_lt: Math.floor(Date.now() / 1000) - daysInSecond - 300,
      },
      orderBy: 'timestamp',
      orderDirection: 'desc',
      first: 1,
    })
  ).blocks
}

async function getAllPairsWithFarms(chainIds: number[], blockNumber: number) {
  let id = '0'
  const allPairs = []
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const pairs = (
      await sdk.PairsWithFarms({
        chainIds: chainIds,
        orderBy: 'id',
        orderDirection: 'asc',
        where: { id_gt: id, feesUSD_gt: 1 },
        first: 1000,
        block: { number: blockNumber },
      })
    ).pairs
    allPairs.push(...pairs)

    if (pairs.length < 1000) {
      break
    }
    id = pairs[999].address
  }
  return allPairs
}
