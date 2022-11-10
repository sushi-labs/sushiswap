import { ChainId } from '@sushiswap/chain'
import { SUSHI_ADDRESS } from '@sushiswap/currency'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import chalk from 'chalk'
import CliTable3 from 'cli-table3'

import { REVENUES_SUPPORTED_CHAIN_NAMES } from '../config'

type Arguments = {
  network?: typeof REVENUES_SUPPORTED_CHAIN_NAMES[number]
}
export async function revenues(args: Arguments) {
  const sdk = getBuiltGraphSDK()

  if (args.network) {
    if (!ChainId[args.network.toUpperCase() as any]) {
      console.log(chalk.red('Please provide a valid network: ' + REVENUES_SUPPORTED_CHAIN_NAMES.join(', ') + '.'))
      return
    } else {
      console.log(chalk.green('Querying revenues for ' + args.network + '...'))
    }
  } else {
    console.log(chalk.green('Querying revenues for all networks...'))
  }

  const chainIds = args.network
    ? [parseInt(ChainId[args.network.toUpperCase() as any])]
    : REVENUES_SUPPORTED_CHAIN_NAMES.map((name) => {
        return parseInt(ChainId[name.toUpperCase() as any])
      })

  const pairs = (
    await sdk.CrossChainPairs({
      chainIds: chainIds,
      orderBy: 'liquidityUSD',
      orderDirection: 'desc',
      first: 1000,
    })
  ).crossChainPairs

  const sushiPriceUSD = await (async function () {
    {
      const prices = await fetch('https://token-price.sushi.com/v0/1').then((data) => data.json())
      return prices[SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase()]
    }
  })()

  const revenues: {
    [chainName: string]: {
      revenue: number
      spent: number
    }
  } = {
    Total: { revenue: 0, spent: 0 },
  }
  for (const pair of pairs) {
    if (!revenues[pair.chainName]) {
      revenues[pair.chainName] = { revenue: 0, spent: 0 }
    }
    if (pair.farm) {
      const sushiIncentive = pair.farm.incentives.find((incentive) => {
        return incentive.rewardToken.address.toLowerCase() == SUSHI_ADDRESS[pair.chainId].toLowerCase()
      })
      if (sushiIncentive) {
        revenues[pair.chainName].spent += sushiIncentive.rewardPerDay * sushiPriceUSD
        revenues['Total'].spent += sushiIncentive.rewardPerDay * sushiPriceUSD
      }
    }
    revenues[pair.chainName].revenue += pair.fees1d / 6
    revenues['Total'].revenue += pair.fees1d / 6
  }

  const orderedRevenues = Object.entries(revenues).sort((a, b) => {
    return a[1].revenue > b[1].revenue ? -1 : 1
  })

  const table = new CliTable3({
    head: [
      chalk.white('Chain'),
      chalk.white('1 day revenues'),
      chalk.white('1 day sushi spent'),
      chalk.white('1 day benefits'),
    ],
    colWidths: [30, 20, 20, 20],
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

  console.log(table.toString())
}
