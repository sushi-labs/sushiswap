import { EventEmitter } from 'node:events'

import { erc20Abi } from 'sushi/abi'
import { Token } from 'sushi/currency'
import { LiquidityProviders, PoolCode, UniV3PoolCode } from '@sushiswap/router'
import { CLTick, RToken, UniV3Pool } from '@sushiswap/tines'
import { Abi, Address, parseAbiItem } from 'abitype'
import { decodeEventLog, Log } from 'viem'

import { Counter } from './Counter'
import { MultiCallAggregator } from './MulticallAggregator'
import { warnLog } from './WarnLog'
import { WordLoadManager } from './WordLoadManager'

interface PoolSelfState {
  blockNumber: number
  fee: number // in 1/1_000_000
  reserve0: bigint
  reserve1: bigint
  tick: number
  liquidity: bigint
  sqrtPriceX96: bigint
}

const globalStateAbi: Abi = [
  {
    inputs: [],
    name: 'globalState',
    outputs: [
      { internalType: 'uint160', name: 'price', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'lastFee', type: 'uint16' },
      { internalType: 'uint8', name: 'pluginConfig', type: 'uint8' },
      { internalType: 'uint16', name: 'communityFee', type: 'uint16' },
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

const feeAbi: Abi = [
  {
    inputs: [],
    name: 'fee',
    outputs: [
      {
        internalType: 'uint16',
        name: 'currentFee',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const AlgebraEventsAbi = [
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
    'event Flash(address indexed sender, address indexed recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)',
  ),
  parseAbiItem('event Fee(uint16 fee)'),
]

export enum AlgebraPoolWatcherStatus {
  Nothing = 'Nothing',
  Something = 'Something',
  All = 'All',
}

// TODO: more ticks and priority depending on resources
// TODO: gather statistics how often (blockNumber < this.latestEventBlockNumber)
export class AlgebraPoolWatcher extends EventEmitter {
  address: Address
  tickHelperContract: Address
  token0: Token
  token1: Token
  spacing = 1
  latestEventBlockNumber = 0

  provider: LiquidityProviders
  client: MultiCallAggregator
  wordLoadManager: WordLoadManager
  state?: PoolSelfState
  updatePoolStateGuard = false
  busyCounter?: Counter
  private lastPoolCode?: PoolCode

  constructor(
    provider: LiquidityProviders,
    address: Address,
    tickHelperContract: Address,
    token0: Token,
    token1: Token,
    client: MultiCallAggregator,
    busyCounter?: Counter,
  ) {
    super()
    this.provider = provider
    this.address = address
    this.tickHelperContract = tickHelperContract
    this.token0 = token0
    this.token1 = token1

    this.client = client
    this.wordLoadManager = new WordLoadManager(
      address,
      this.spacing,
      tickHelperContract,
      client,
      busyCounter,
    )
    this.wordLoadManager.on('ticksChanged', () => {
      this.lastPoolCode = undefined
    })
    this.busyCounter = busyCounter
  }

  async updatePoolState() {
    if (!this.updatePoolStateGuard) {
      this.updatePoolStateGuard = true
      if (this.busyCounter) this.busyCounter.inc()
      try {
        for (;;) {
          const {
            blockNumber,
            returnValues: [globalState, liquidity, fee, balance0, balance1],
          } = await this.client.callSameBlock([
            {
              address: this.address,
              abi: globalStateAbi,
              functionName: 'globalState',
            },
            {
              address: this.address,
              abi: liquidityAbi,
              functionName: 'liquidity',
            },
            { address: this.address, abi: feeAbi, functionName: 'fee' },
            {
              address: this.token0.address as Address,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: [this.address],
            },
            {
              address: this.token1.address as Address,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: [this.address],
            },
          ])
          if (blockNumber < this.latestEventBlockNumber) continue // later events already have came

          const [price, tick] = globalState as [bigint, number]
          this.state = {
            blockNumber,
            fee: Number(fee as bigint),
            reserve0: balance0 as bigint,
            reserve1: balance1 as bigint,
            tick: Math.floor(tick / this.spacing) * this.spacing,
            liquidity: liquidity as bigint,
            sqrtPriceX96: price,
          }
          this.lastPoolCode = undefined

          this.wordLoadManager.onPoolTickChange(this.state.tick, true)
          this.wordLoadManager.once('isUpdated', () => this.emit('isUpdated'))
          break
        }
      } catch (e) {
        warnLog(this.client.chainId, `Pool ${this.address} update failed: ${e}`)
      }
      if (this.busyCounter) this.busyCounter.dec()
      this.updatePoolStateGuard = false
    }
  }

  processLog(l: Log): string {
    this.latestEventBlockNumber = Math.max(
      this.latestEventBlockNumber,
      Number(l.blockNumber || 0),
    )
    if (l.removed) {
      this.updatePoolState()
      return 'Removed'
    }

    if (l.blockNumber == null) return 'Error!'
    const data = decodeEventLog({
      abi: AlgebraEventsAbi,
      data: l.data,
      topics: l.topics,
    })
    switch (data.eventName) {
      case 'Mint': {
        const { amount, amount0, amount1 } = data.args
        const { tickLower, tickUpper } = data.args
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          if (tickLower !== undefined && tickUpper !== undefined && amount) {
            const tick = this.state.tick
            if (tickLower <= tick && tick < tickUpper)
              this.state.liquidity += amount
          }
          if (amount1 !== undefined && amount0 !== undefined) {
            this.state.reserve0 += amount0
            this.state.reserve1 += amount1
          }
        }
        if (tickLower !== undefined && tickUpper !== undefined && amount) {
          this.wordLoadManager.addTick(l.blockNumber, tickLower, amount)
          this.wordLoadManager.addTick(l.blockNumber, tickUpper, -amount)
        }
        this.lastPoolCode = undefined
        break
      }
      case 'Burn': {
        const { amount } = data.args
        const { tickLower, tickUpper } = data.args
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          if (tickLower !== undefined && tickUpper !== undefined && amount) {
            const tick = this.state.tick
            if (tickLower <= tick && tick < tickUpper)
              this.state.liquidity -= amount
          }
        }
        if (tickLower !== undefined && tickUpper !== undefined && amount) {
          this.wordLoadManager.addTick(l.blockNumber, tickLower, -amount)
          this.wordLoadManager.addTick(l.blockNumber, tickUpper, amount)
        }
        this.lastPoolCode = undefined
        break
      }
      case 'Collect': {
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          const { amount0, amount1 } = data.args
          if (amount0 !== undefined && amount1 !== undefined) {
            this.state.reserve0 -= amount0
            this.state.reserve1 -= amount1
          }
        }
        this.lastPoolCode = undefined
        break
      }
      case 'Flash': {
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          const { paid0, paid1 } = data.args
          if (paid0 !== undefined && paid1 !== undefined) {
            this.state.reserve0 += paid0
            this.state.reserve1 += paid1
          }
        }
        this.lastPoolCode = undefined
        break
      }
      case 'Swap': {
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          const { amount0, amount1, sqrtPriceX96, liquidity, tick } = data.args
          if (amount0 !== undefined && amount1 !== undefined) {
            this.state.reserve0 += amount0
            this.state.reserve1 += amount1
          }
          if (sqrtPriceX96 !== undefined) this.state.sqrtPriceX96 = sqrtPriceX96
          if (liquidity !== undefined) this.state.liquidity = liquidity
          if (tick !== undefined) {
            this.state.tick = Math.floor(tick / this.spacing) * this.spacing
            this.wordLoadManager.onPoolTickChange(this.state.tick, false)
          }
        }
        this.lastPoolCode = undefined
        break
      }
      case 'Fee': {
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          const { fee } = data.args
          this.state.fee = fee
        }
        this.lastPoolCode = undefined
        break
      }
      default:
    }

    return data.eventName
  }

  getPoolCode(): PoolCode | undefined {
    if (this.lastPoolCode) return this.lastPoolCode
    if (this.state === undefined) return
    const ticks = this.wordLoadManager.getMaxTickDiapason(this.state.tick)
    if (ticks.length === 0) return

    const v3Pool = new UniV3Pool(
      this.address,
      this.token0 as RToken,
      this.token1 as RToken,
      this.state.fee / 1_000_000,
      this.state.reserve0,
      this.state.reserve1,
      this.state.tick,
      this.state.liquidity,
      this.state.sqrtPriceX96,
      ticks,
    )
    const pc = new UniV3PoolCode(v3Pool, this.provider, this.provider)
    this.lastPoolCode = pc
    return pc
  }

  getTicks(): CLTick[] {
    if (this.state === undefined) return []
    return this.wordLoadManager.getMaxTickDiapason(this.state.tick)
  }

  isStable(): boolean {
    return (
      this.state !== undefined && !this.wordLoadManager.downloadCycleIsStared
    )
  }

  getStatus(): AlgebraPoolWatcherStatus {
    if (this.state === undefined) return AlgebraPoolWatcherStatus.Nothing
    if (!this.wordLoadManager.downloadCycleIsStared)
      return AlgebraPoolWatcherStatus.All
    if (this.wordLoadManager.hasSomeTicksAround(this.state.tick))
      return AlgebraPoolWatcherStatus.Something
    return AlgebraPoolWatcherStatus.Nothing
  }

  statusPromise?: Promise<void>
  async statusAll(): Promise<void> {
    if (this.state !== undefined && !this.wordLoadManager.downloadCycleIsStared)
      return Promise.resolve()
    if (this.statusPromise !== undefined) return this.statusPromise
    this.statusPromise = new Promise((resolve) => {
      this.wordLoadManager.once('isUpdated', () => resolve())
    })
    await this.statusPromise
    this.statusPromise = undefined
  }
}
