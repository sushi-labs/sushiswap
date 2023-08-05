import { ChainId } from '@sushiswap/chain'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { Address, createPublicClient, http, Log, parseAbiItem, PublicClient } from 'viem'
import { Chain, mainnet } from 'viem/chains'

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
    diapasons.forEach((d, i) => console.log(`${d.name}: ${this.counters[i] / this.total}`))
  }
}

const tokenCache: Map<Address, number | null> = new Map()
async function getPrice(token: Address): Promise<number | null> {
  const cached = tokenCache.get(token)
  if (cached !== undefined) return cached

  const erc20 = token == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? WNATIVE_ADDRESS[ChainId.ETHEREUM] : token
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${erc20}`)
  const data = await response.json()
  const price = data?.market_data?.current_price?.usd
  const decimals = data?.detail_platforms?.ethereum?.decimal_place
  if (price && decimals) {
    const priceWei = price / Math.pow(10, decimals)
    tokenCache.set(token, priceWei)
    return priceWei
  } else {
    tokenCache.set(token, null)
    return null
  }
}

async function getLogTime(client: PublicClient, l: Log) {
  const block = await client.getBlock({ blockNumber: l.blockNumber ?? 0n })
  const date = new Date(Number(block.timestamp) * 1000)
  return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`
}

async function getSlippageStatistics(args: {
  providerURL: string
  chain: Chain
  RP3Address: Address
  fromBlock?: bigint
}) {
  const transport = http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })

  const blockNumCurrent = await client.getBlockNumber()

  const logs = await client.getLogs({
    address: args.RP3Address,
    fromBlock: blockNumCurrent - 100_000n,
    event: parseAbiItem(
      `event Route(address indexed from, address to, address indexed tokenIn, address indexed tokenOut, uint amountIn, uint amountOutMin, uint amountOut)`
    ),
  })
  const diagram = new Diargam(diapasons)
  let positiveSurplus = 0

  for (let i = 0; i < logs.length; ++i) {
    const args = logs[i].args
    if (args.amountOut && args.amountOutMin && args.tokenOut) {
      const diff = Number(args.amountOut) / Number(args.amountOutMin) - 1
      diagram.addPoint(diff * 10_000)
      if (diff > 0.005 && diff < 0.025) {
        const price = await getPrice(args.tokenOut)
        const amount = Number(args.amountOut) - Number(args.amountOutMin) * 1.005
        if (price !== null) {
          positiveSurplus += amount * price
          if (amount * price > 100) console.log(`${args.tokenOut} ${logs[i].transactionHash} ${amount * price}`)
          //console.log(`Token ${args.tokenOut} price: ${price}`)
        } //else console.log(`Unknown token: ${args.tokenOut}`)
      }
    } //else console.log(args)
  }

  if (logs.length > 0) {
    const start = await getLogTime(client, logs[0])
    const finish = await getLogTime(client, logs[logs.length - 1])
    console.log(`Total logs: ${logs.length} ${start} - ${finish}`)
    diagram.print()
    console.log(`Positive surplus: ${Math.round(positiveSurplus)} usd`)
  } else console.log(`Total logs: ${logs.length}`)
}

it.skip('RP3 Ethereum slippage statistics', async () => {
  await getSlippageStatistics({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    RP3Address: RP3Address[ChainId.ETHEREUM] as Address,
  })
})
