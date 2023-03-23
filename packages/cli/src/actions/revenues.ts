import { ChainId, chainName } from '@sushiswap/chain'
import { SUSHI_ADDRESS } from '@sushiswap/currency'
import { Block, getBuiltGraphSDK } from '@sushiswap/graph-client'
import chalk from 'chalk'
import CliTable3 from 'cli-table3'
import fetch from 'node-fetch'

import { REVENUES_SUPPORTED_CHAIN_NAMES } from '../config.js'

const sdk = getBuiltGraphSDK()

type Arguments = {
  network?: (typeof REVENUES_SUPPORTED_CHAIN_NAMES)[number]
  days?: string
}

type PairRevenue = {
  name: string
  address: string
  revenue: number
  spent: number
  volume: number
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

  const sushiPriceUSD = await (async function () {
    {
      const prices = await fetch('https://token-price.sushi.com/v0/1').then((data) => data.json())
      return prices[SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase()]
    }
  })()

  const lastBlocks = await getBlockByTimestamp(chainIds, 0) //lastest block
  const pastBlocks = await getBlockByTimestamp(chainIds, days) //block x days ago

  const revenues = await processRevenues(lastBlocks, pastBlocks, sushiPriceUSD, days)

  const orderedRevenues = Object.entries(revenues).sort((a, b) => {
    const benefitsA = a[1].revenue - a[1].spent
    const benefitsB = b[1].revenue - b[1].spent
    return benefitsA > benefitsB ? -1 : 1
  })

  const table = new CliTable3({
    head: [
      chalk.white('Chain'),
      chalk.white('Pair'),
      chalk.white('Address'),
      chalk.white(days + ' day(s) volume'),
      chalk.white(days + ' day(s) revenues'),
      chalk.white(days + ' day(s) sushi spent'),
      chalk.white(days + ' day(s) benefits'),
    ],
    colWidths: [25, 15, 50, 25, 25, 25, 25],
  })

  for (const revenue of orderedRevenues) {
    //total revenues
    const benefits = revenue[1].revenue - revenue[1].spent
    const benefitsString = chalk.bold(benefits.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $')
    table.push([
      chalk.bold(revenue[0]),
      chalk.bold('Total'),
      '',
      chalk.bold(revenue[1].volume.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $'),
      chalk.bold(revenue[1].revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $'),
      chalk.bold(revenue[1].spent.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $'),
      benefits > 0 ? chalk.green(benefitsString) : chalk.red(benefitsString),
    ])
    revenue[1].pairs.sort((a, b) => {
      const benefitsA = a.revenue - a.spent
      const benefitsB = b.revenue - b.spent
      return benefitsA > benefitsB ? -1 : 1
    })
    //pairs details
    const topPairs = [...revenue[1].pairs.slice(0, 5), ...revenue[1].pairs.slice(-5).reverse()]
    topPairs.map((pair, i) => {
      const pairBenefits = pair.revenue - pair.spent
      const pairBenefitsString = pairBenefits.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $'
      table.push([
        i === 0 ? 'Best 5 pairs' : i === 5 ? 'Worst 5 pairs' : '',
        pair.name,
        pair.address,
        pair.volume.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $',
        pair.revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $',
        pair.spent.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $',
        pairBenefits > 0 ? chalk.green(pairBenefitsString) : chalk.red(pairBenefitsString),
      ])
    })
  }

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
      await sdk.PairsByChainIds({
        chainIds: chainIds,
        orderBy: 'id',
        orderDirection: 'asc',
        where: { id_gt: id, liquidityUSD_gt: 100 },
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

  const incentivizedPools = await (await import('@sushiswap/client')).getPools({ isIncentivized: true, take: 1000 })

  return allPairs.map((pair) => {
    const incentivizedPool = incentivizedPools.find(({ id }) => id === pair.id)
    if (!incentivizedPool) return pair

    return {
      ...pair,
      incentives: incentivizedPool.incentives,
    }
  })
}

async function processRevenues(lastBlocks: Array<Pick<Block, 'id' | 'chainId' | 'number' | 'timestamp'>>, pastBlocks: Array<Pick<Block, 'id' | 'chainId' | 'number' | 'timestamp'>>, sushiPriceUSD: number, days: number) {
  const revenues: {
    [chainName: string]: {
      volume: number
      revenue: number
      spent: number
      pairs: PairRevenue[]
    }
  } = {
    Total: { revenue: 0, spent: 0, volume: 0, pairs: [] },
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
          revenues[chainName[pair.chainId]] = {
            revenue: 0,
            volume: 0,
            spent: 0,
            pairs: [],
          }
        }

        let spent = 0
        //process spending
        if ('incentives' in pair && pair.incentives.length > 0) {
          const sushiIncentive = pair.incentives.find((incentive) => {
            return (
              incentive.rewardToken.address.toLowerCase() ==
              SUSHI_ADDRESS[pair.chainId as keyof typeof SUSHI_ADDRESS].toLowerCase()
            )
          })
          if (sushiIncentive) {
            spent = Number(sushiIncentive.rewardPerDay) * Number(sushiPriceUSD) * days
          }
        }
        //process revenues
        const previousFees = Number(pastPairs.find((p) => p.id === pair.id)?.feesUSD)
        const revenue = (previousFees ? Number(pair.feesUSD) - previousFees : Number(pair.feesUSD)) / 6
        const previousVolume = Number(pastPairs.find((p) => p.id === pair.id)?.volumeUSD)
        const volume = previousVolume ? Number(pair.volumeUSD) - previousVolume : Number(pair.volumeUSD)

        //push results
        revenues[chainName[pair.chainId]].pairs.push({
          name: pair.name,
          address: pair.address,
          spent: spent,
          revenue: revenue,
          volume: volume,
        })
        revenues[chainName[pair.chainId]].spent += spent
        revenues[chainName[pair.chainId]].revenue += revenue
        revenues[chainName[pair.chainId]].volume += volume
        revenues['Total'].spent += spent
        revenues['Total'].revenue += revenue
        revenues['Total'].volume += volume
      }
    })
  )
  return revenues
}
