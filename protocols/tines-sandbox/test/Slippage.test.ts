import { ChainId } from 'sushi/chain'
import { WNATIVE_ADDRESS } from 'sushi/currency'
import {
  http,
  Address,
  Log,
  PublicClient,
  createPublicClient,
  parseAbiItem,
} from 'viem'
import { Chain, arbitrum, mainnet, optimism, polygon } from 'viem/chains'

import { RP3Address } from './Extractor.test'

interface Diapason {
  from: number
  //to: number
  name: string
}

const diapasons: Diapason[] = [
  {
    from: 0,
    name: '      -0.5%',
  },
  {
    from: 5,
    name: ' -0.5% - 0%',
  },
  {
    from: 45,
    name: '       0.0%',
  },
  {
    from: 55,
    name: '0.0% - 0.5%',
  },
  {
    from: 100,
    name: '  0.5% - 1%',
  },
  {
    from: 150,
    name: '    1% - 2%',
  },
  {
    from: 250,
    name: '       > 2%',
  },
]

class Diargam {
  diapasons: Diapason[]
  counters: number[]
  total = 0

  constructor(diapasons: Diapason[]) {
    this.diapasons = diapasons
    this.counters = diapasons.map(() => 0)
  }

  addPoint(p: number) {
    ++this.total
    for (let i = this.diapasons.length - 1; i >= 0; --i) {
      const diap = this.diapasons[i]
      if (diap.from <= p) {
        this.counters[i]++
        return
      }
    }
  }

  print() {
    diapasons.forEach((d, i) =>
      console.log(`${d.name}: ${this.counters[i] / this.total}`),
    )
  }
}

const coinGeckoPlatform = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.POLYGON]: 'polygon-pos',
  [ChainId.ARBITRUM]: 'arbitrum-one',
  [ChainId.OPTIMISM]: 'optimistic-ethereum',
} as const

const tokenCache: Map<Address, number | null> = new Map()
async function getPrice(
  token: Address,
  chainId: ChainId,
): Promise<number | null> {
  const cached = tokenCache.get(token)
  if (cached !== undefined) return cached

  const platform = coinGeckoPlatform[chainId]
  const erc20 =
    token === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      ? WNATIVE_ADDRESS[chainId]
      : token
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${platform}/contract/${erc20}`,
  )
  const data = await response.json()
  const price = data?.market_data?.current_price?.usd
  const decimals = data?.detail_platforms?.[platform].decimal_place
  if (price && decimals) {
    const priceWei = price / 10 ** decimals
    tokenCache.set(token, priceWei)
    return priceWei
  } else {
    tokenCache.set(token, null)
    return null
  }
}

async function getLogTime(client: PublicClient, l: Log) {
  const block = await client.getBlock({
    blockNumber: l.blockNumber ?? BigInt(0),
  })
  const date = new Date(Number(block.timestamp) * 1000)
  return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString(
    'en-US',
  )}`
}

async function getSlippageStatistics(args: {
  providerURL: string
  chain: Chain
  RP3Address: Address
  blockQuantity: number
  fromBlock?: bigint
}) {
  const transport = http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })
  const chainId = args.chain.id as ChainId

  const blockNumCurrent = await client.getBlockNumber()

  const logs = await client.getLogs({
    address: args.RP3Address,
    fromBlock: blockNumCurrent - BigInt(args.blockQuantity),
    event: parseAbiItem(
      'event Route(address indexed from, address to, address indexed tokenIn, address indexed tokenOut, uint amountIn, uint amountOutMin, uint amountOut)',
    ),
  })
  const diagram = new Diargam(diapasons)
  let positiveSurplus = 0
  let mevedNumber = 0
  let mevedOutputAmout = 0

  for (let i = 0; i < logs.length; ++i) {
    const logArgs = logs[i].args
    if (logArgs.amountOut && logArgs.amountOutMin && logArgs.tokenOut) {
      const diff = Number(logArgs.amountOut) / Number(logArgs.amountOutMin) - 1
      diagram.addPoint(diff * 10_000)
      if (diff > 0.005 && diff < 0.025) {
        const price = await getPrice(logArgs.tokenOut, chainId)
        const amount =
          Number(logArgs.amountOut) - Number(logArgs.amountOutMin) * 1.005
        if (price !== null) {
          positiveSurplus += amount * price
          if (amount * price > 100)
            console.log(
              `${logArgs.tokenOut} ${logs[i].transactionHash} ${
                amount * price
              }`,
            )
          //console.log(`Token ${logArgs.tokenOut} price: ${price}`)
        } //else console.log(`Unknown token: ${logArgs.tokenOut}`)
      }
      if (diff < 0.0005) {
        ++mevedNumber
        const price = await getPrice(logArgs.tokenOut, chainId)
        if (price !== null)
          mevedOutputAmout += Number(logArgs.amountOutMin) * price
      }
      if (diff > 1) {
        const price = await getPrice(logArgs.tokenOut, chainId)
        const amount =
          Number(logArgs.amountOut) - Number(logArgs.amountOutMin) * 1.005
        if (price !== null) {
          console.log(
            `${logArgs.tokenOut} ${logs[i].transactionHash} ${amount * price}`,
          )
        }
      }
    } //else console.log(args)
  }

  if (logs.length > 0) {
    const start = await getLogTime(client, logs[0])
    const finish = await getLogTime(client, logs[logs.length - 1])
    console.log(`Total logs: ${logs.length} ${start} - ${finish}`)
    diagram.print()
    console.log(`Positive surplus: ${Math.round(positiveSurplus)} usd`)
    console.log(
      `MEVed: ${mevedNumber} transactions, total value: ${
        mevedOutputAmout * 0.005
      } usd`,
    )
  } else console.log(`Total logs: ${logs.length}`)
}

// 10K/month + 10K/month if protected against MEV
it.skip('RP3 Ethereum slippage statistics', async () => {
  await getSlippageStatistics({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    blockQuantity: 100_000,
    RP3Address: RP3Address[ChainId.ETHEREUM] as Address,
  })
})

// 1.5K/month
it.skip('RP3 Polygon slippage statistics', async () => {
  await getSlippageStatistics({
    providerURL: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: polygon,
    blockQuantity: 100_000,
    RP3Address: RP3Address[ChainId.POLYGON] as Address,
  })
})

// 5K/month
it.skip('RP3 Arbitrum slippage statistics', async () => {
  await getSlippageStatistics({
    providerURL: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: arbitrum,
    blockQuantity: 1_000_000,
    RP3Address: RP3Address[ChainId.ARBITRUM] as Address,
  })
})

// 500/month
it.skip('RP3 Optimism slippage statistics', async () => {
  await getSlippageStatistics({
    providerURL: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: optimism,
    blockQuantity: 500_000,
    RP3Address: RP3Address[ChainId.OPTIMISM] as Address,
  })
})
