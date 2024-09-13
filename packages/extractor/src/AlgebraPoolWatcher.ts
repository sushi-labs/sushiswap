import { EventEmitter } from 'node:events'
import { Abi, Address, parseAbiItem } from 'abitype'
import { erc20Abi_balanceOf } from 'sushi/abi'
import { Token } from 'sushi/currency'
import { LiquidityProviders, PoolCode, UniV3PoolCode } from 'sushi/router'
import { CLTick, RToken, UniV3Pool } from 'sushi/tines'
import { Log, decodeEventLog } from 'viem'
import { Counter } from './Counter.js'
import { Logger } from './Logger.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { WordLoadManager } from './WordLoadManager.js'

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
  Failed = 'Failed',
  Nothing = 'Nothing',
  Something = 'Something',
  All = 'All',
}

// TODO: more ticks and priority depending on resources
// TODO: gather statistics how often (blockNumber < this.latestEventBlockNumber)
// event PoolCodeWasChanged is emitted each time getPoolCode() returns another pool (lastPoolCode changed)
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
  status: AlgebraPoolWatcherStatus = AlgebraPoolWatcherStatus.Nothing

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
      this._poolWasChanged()
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
              abi: erc20Abi_balanceOf,
              functionName: 'balanceOf',
              args: [this.address],
            },
            {
              address: this.token1.address as Address,
              abi: erc20Abi_balanceOf,
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
          this._poolWasChanged()

          if (this.getStatus() === AlgebraPoolWatcherStatus.Nothing) {
            this.wordLoadManager.once('ticksChanged', () => {
              if (this.getStatus() === AlgebraPoolWatcherStatus.Nothing)
                this.setStatus(AlgebraPoolWatcherStatus.Something)
            })
          }
          this.wordLoadManager.once('isUpdated', () => {
            this.setStatus(AlgebraPoolWatcherStatus.All)
            this.emit('isUpdated')
          })
          this.wordLoadManager.onPoolTickChange(this.state.tick, true)
          break
        }
      } catch (e) {
        Logger.error(
          this.client.chainId,
          `Alg Pool ${this.address} update failed`,
          e,
        )
        this.setStatus(AlgebraPoolWatcherStatus.Failed)
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
        this._poolWasChanged()
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
        this._poolWasChanged()
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
        this._poolWasChanged()
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
        this._poolWasChanged()
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
        this._poolWasChanged()
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
        this._poolWasChanged()
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
    return this.status
  }

  setStatus(status: AlgebraPoolWatcherStatus) {
    if (status === this.status) return
    this.status = status
    if (
      status === AlgebraPoolWatcherStatus.Failed &&
      this.downloadFinishedPromiseReject
    )
      this.downloadFinishedPromiseReject()
    if (
      status === AlgebraPoolWatcherStatus.All &&
      this.downloadFinishedPromiseResolve
    )
      this.downloadFinishedPromiseResolve()
  }

  downloadFinishedPromise?: Promise<void>
  downloadFinishedPromiseResolve?: () => void
  downloadFinishedPromiseReject?: () => void
  async downloadFinished(): Promise<void> {
    if (this.status === AlgebraPoolWatcherStatus.All) return Promise.resolve()
    if (this.status === AlgebraPoolWatcherStatus.Failed) return Promise.reject()
    if (this.downloadFinishedPromise !== undefined)
      return this.downloadFinishedPromise
    this.downloadFinishedPromise = new Promise((resolve, reject) => {
      this.downloadFinishedPromiseResolve = resolve
      this.downloadFinishedPromiseReject = reject
    })
    await this.downloadFinishedPromise
    this.downloadFinishedPromise = undefined
    this.downloadFinishedPromiseResolve = undefined
    this.downloadFinishedPromiseReject = undefined
  }

  private _poolWasChanged() {
    if (this.lastPoolCode !== undefined) {
      this.lastPoolCode = undefined
      this.emit('PoolCodeWasChanged', this)
    }
  }
}
