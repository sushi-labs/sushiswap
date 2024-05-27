import { http, createPublicClient, parseAbiItem } from 'viem'
import { arbitrum } from 'viem/chains'

const delay = async (ms) => new Promise((res) => setTimeout(res, ms))

const events = [
  parseAbiItem('event Sync(uint112 reserve0, uint112 reserve1)'),
  parseAbiItem(
    'event Mint(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  ),
  parseAbiItem(
    'event Collect(address indexed owner, address recipient, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount0, uint128 amount1)',
  ),
  parseAbiItem(
    'event Burn(address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  ),
  parseAbiItem(
    'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
  ),
  parseAbiItem(
    // For Pancake
    'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick, uint128 protocolFeesToken0, uint128 protocolFeesToken1)',
  ),
  parseAbiItem(
    'event Flash(address indexed sender, address indexed recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)',
  ),
  parseAbiItem(
    'event CollectProtocol(address indexed sender, address indexed recipient, uint128 amount0, uint128 amount1)',
  ),
]

async function providerTest(provider) {
  const client = createPublicClient({
    chain: arbitrum,
    transport: http(provider),
  })
  client
    .createEventFilter({
      events,
    })
    .then((filter) => {
      console.log(`New LogFilter was created: ${filter.id}`)
      const unWatchBlocks = client.watchBlocks({
        onBlock: async (block) => {
          try {
            const logs = await client.getFilterChanges({ filter })
            //if (Math.random() < 1 / 5) throw new Error('Test error')
            console.log(
              `Block #${block.number} (timestamp ${block.timestamp}): ${logs.length} logs`,
            )
          } catch (e) {
            console.log(new Date(), `filter ${filter.id} failed:`, e)
            unWatchBlocks()
            providerTest(provider)
          }
        },
      })
      // client.watchBlockNumber({
      //   onBlockNumber: (blockNumber) => console.log(`Block ${blockNumber}`),
      // })
    })

  await delay(1000 * 3600)
}

const network = process.argv[process.argv.length - 1]

await providerTest(
  `https://lb.drpc.org/ogrpc?network=${network}&dkey=${process.env.DRPC_ID}`,
)
