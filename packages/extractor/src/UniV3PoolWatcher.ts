import { erc20Abi } from '@sushiswap/abi'
import { Token } from '@sushiswap/currency'
import { LiquidityProviders, PoolCode, UniV3PoolCode } from '@sushiswap/router'
import { RToken, UniV3Pool } from '@sushiswap/tines'
import { FeeAmount, TICK_SPACINGS } from '@sushiswap/v3-sdk'
import { Abi, Address, parseAbiItem } from 'abitype'
import { BigNumber } from 'ethers'
import { decodeEventLog, Log } from 'viem'

import { MultiCallAggregator } from './MulticallAggregator'
import { WordLoadManager } from './WordLoadManager'

interface UniV3PoolSelfState {
  blockNumber: number
  reserve0: bigint
  reserve1: bigint
  tick: number
  liquidity: bigint
  sqrtPriceX96: bigint
}

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

export const UniV3EventsAbi = [
  parseAbiItem(
    'event Mint(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)'
  ),
  parseAbiItem(
    'event Collect(address indexed owner, address recipient, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount0, uint128 amount1)'
  ),
  parseAbiItem(
    'event Burn(address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)'
  ),
  parseAbiItem(
    'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)'
  ),
  parseAbiItem(
    'event Flash(address indexed sender, address indexed recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)'
  ),
  parseAbiItem(
    'event CollectProtocol(address indexed sender, address indexed recipient, uint128 amount0, uint128 amount1)'
  ),
]

// TODO: more ticks and priority depending on resources
// TODO: gather statistics how often (blockNumber < this.latestEventBlockNumber)
export class UniV3PoolWatcher {
  address: Address
  tickHelperContract: Address
  token0: Token
  token1: Token
  fee: FeeAmount
  spacing: number
  latestEventBlockNumber = 0

  providerName: string
  client: MultiCallAggregator
  wordLoadManager: WordLoadManager
  state?: UniV3PoolSelfState
  updatePoolStateGuard = false

  constructor(
    providerName: string,
    address: Address,
    tickHelperContract: Address,
    token0: Token,
    token1: Token,
    fee: FeeAmount,
    client: MultiCallAggregator
  ) {
    this.providerName = providerName
    this.address = address
    this.tickHelperContract = tickHelperContract
    this.token0 = token0
    this.token1 = token1
    this.fee = fee
    this.spacing = TICK_SPACINGS[fee]

    this.client = client
    this.wordLoadManager = new WordLoadManager(address, this.spacing, tickHelperContract, client)
  }

  async updatePoolState() {
    if (!this.updatePoolStateGuard) {
      this.updatePoolStateGuard = true
      for (;;) {
        const {
          blockNumber,
          returnValues: [slot0, liquidity, balance0, balance1],
        } = await this.client.callSameBlock([
          { address: this.address, abi: slot0Abi, functionName: 'slot0' },
          { address: this.address, abi: liquidityAbi, functionName: 'liquidity' },
          { address: this.token0.address as Address, abi: erc20Abi, functionName: 'balanceOf', args: [this.address] },
          { address: this.token1.address as Address, abi: erc20Abi, functionName: 'balanceOf', args: [this.address] },
        ])
        if (blockNumber < this.latestEventBlockNumber) continue // later events already have came

        const [sqrtPriceX96, tick] = slot0 as [bigint, number]
        this.state = {
          blockNumber,
          reserve0: balance0 as bigint,
          reserve1: balance1 as bigint,
          tick: Math.floor(tick / this.spacing) * this.spacing,
          liquidity: liquidity as bigint,
          sqrtPriceX96: sqrtPriceX96 as bigint,
        }

        this.wordLoadManager.onPoolTickChange(this.state.tick, true)
        break
      }
      this.updatePoolStateGuard = false
    }
  }

  processLog(l: Log) {
    this.latestEventBlockNumber = Math.max(this.latestEventBlockNumber, Number(l.blockNumber || 0))
    if (l.removed) {
      this.updatePoolState()
      return
    }

    if (l.blockNumber == null) return
    const data = decodeEventLog({ abi: UniV3EventsAbi, data: l.data, topics: l.topics })
    switch (data.eventName) {
      case 'Mint':
      case 'Burn': {
        let { amount, amount0, amount1 } = data.args
        if (data.eventName == 'Burn') {
          amount = amount === undefined ? undefined : -amount
          amount0 = amount0 === undefined ? undefined : -amount0
          amount1 = amount1 === undefined ? undefined : -amount1
        }
        const { tickLower, tickUpper } = data.args
        if (this.state !== undefined && l.blockNumber > this.state.blockNumber) {
          if (tickLower !== undefined && tickUpper !== undefined && amount) {
            const tick = this.state.tick
            if (tickLower <= tick && tick < tickUpper) this.state.liquidity += amount
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
        break
      }
      case 'Collect':
      case 'CollectProtocol': {
        if (this.state !== undefined && l.blockNumber > this.state.blockNumber) {
          const { amount0, amount1 } = data.args
          if (amount0 !== undefined && amount1 !== undefined) {
            this.state.reserve0 -= amount0
            this.state.reserve1 -= amount1
          }
        }
        break
      }
      case 'Flash': {
        if (this.state !== undefined && l.blockNumber > this.state.blockNumber) {
          const { paid0, paid1 } = data.args
          if (paid0 !== undefined && paid1 !== undefined) {
            this.state.reserve0 += paid0
            this.state.reserve1 += paid1
          }
        }
        break
      }
      case 'Swap': {
        if (this.state !== undefined && l.blockNumber > this.state.blockNumber) {
          const { amount0, amount1, sqrtPriceX96, liquidity, tick } = data.args
          if (amount0 !== undefined && amount1 !== undefined) {
            this.state.reserve0 -= amount0
            this.state.reserve1 -= amount1
          }
          if (sqrtPriceX96 !== undefined) this.state.sqrtPriceX96 = sqrtPriceX96
          if (liquidity !== undefined) this.state.liquidity = liquidity
          if (tick !== undefined) {
            this.state.tick = Math.floor(tick / this.spacing) * this.spacing
            this.wordLoadManager.onPoolTickChange(this.state.tick, false)
          }
        }
        break
      }
      default:
    }
  }

  getPoolCode(): PoolCode | undefined {
    if (this.state === undefined) return
    const ticks = this.wordLoadManager.getMaxTickDiapason(this.state.tick)
    if (ticks.length == 0) return

    const v3Pool = new UniV3Pool(
      this.address,
      this.token0 as RToken,
      this.token1 as RToken,
      this.fee / 1_000_000,
      BigNumber.from(this.state.reserve0),
      BigNumber.from(this.state.reserve1),
      this.state.tick,
      BigNumber.from(this.state.liquidity),
      BigNumber.from(this.state.sqrtPriceX96),
      ticks
    )
    const pc = new UniV3PoolCode(v3Pool, LiquidityProviders.UniswapV3, this.providerName)
    return pc
  }
}
