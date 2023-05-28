import { erc20Abi } from '@sushiswap/abi'
import { Token } from '@sushiswap/currency'
import { PoolCode } from '@sushiswap/routers'
import { CLTick } from '@sushiswap/tines'
import { FeeAmount, TICK_SPACINGS } from '@sushiswap/v3-sdk'
import { Abi, Address, parseAbiItem } from 'abitype'
import { Log } from 'viem'

import { EventManager } from './EventManager'
import { MultiCallAggregator } from './MulticallAggregator'

interface UniV3PooSelfState {
  reserve0: bigint
  reserve1: bigint
  tick: number
  liquidity: bigint
  sqrtPriceX96: bigint
}

// interface Word {
//   index: number
//   ticks: CLTick[]
// }

const slot0Abi: Abi = [
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'observationIndex', type: 'uint16' },
      { internalType: 'uint16', name: 'observationCardinality', type: 'uint16' },
      { internalType: 'uint16', name: 'observationCardinalityNext', type: 'uint16' },
      { internalType: 'uint8', name: 'feeProtocol', type: 'uint8' },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const liquidityAbi: Abi = [
  {
    inputs: [],
    name: 'liquidity',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const mintEventAbi = parseAbiItem(
  'event Mint(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)'
)

export class UniV3PoolWatcher {
  address: Address
  token0: Token
  token1: Token
  fee: FeeAmount
  spacing: number

  client: MultiCallAggregator
  eventManager: EventManager
  watchWordList: Set<number> = new Set()

  state?: UniV3PooSelfState
  ticks: CLTick[]

  constructor(
    address: Address,
    token0: Token,
    token1: Token,
    fee: FeeAmount,
    client: MultiCallAggregator,
    eventManager: EventManager
  ) {
    this.address = address
    this.token0 = token0
    this.token1 = token1
    this.fee = fee
    this.spacing = TICK_SPACINGS[fee]

    this.client = client
    this.eventManager = eventManager
  }

  async startWatching() {
    // TODO: make it for one block and return it?
    const [slot0, liquidity, balance0, balance1] = await Promise.all([
      this.client.call(this.address, slot0Abi, 'slot0'),
      this.client.call(this.address, liquidityAbi, 'liquidity'),
      this.client.call(this.token0.address as Address, erc20Abi, 'balanceOf', [this.address]),
      this.client.call(this.token1.address as Address, erc20Abi, 'balanceOf', [this.address]),
    ])

    const [sqrtPriceX96, tick] = slot0 as [bigint, number]
    this.state = {
      reserve0: balance0 as bigint,
      reserve1: balance1 as bigint,
      tick: Math.floor(tick / this.spacing) * this.spacing,
      liquidity: liquidity as bigint,
      sqrtPriceX96: sqrtPriceX96 as bigint,
    }

    this.eventManager.startEventListening(this.address, mintEventAbi, (l: Log) => {
      // TODO
    })
    // TODO: other listeners

    //TODO: start ticks download and watching
  }

  async stopWatching() {
    // TODO
  }

  getPoolCode(): PoolCode {
    // TODO
  }
}
