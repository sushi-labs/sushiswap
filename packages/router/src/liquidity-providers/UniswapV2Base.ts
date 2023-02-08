import { keccak256, pack } from '@ethersproject/solidity'
import { getReservesAbi } from '@sushiswap/abi'
import { ChainId, chainShortName } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { Address, readContracts, watchBlockNumber } from '@wagmi/core'
import { getCreate2Address } from 'ethers/lib/utils'

import { getPoolsByTokenIds, getTopPools } from '../lib/api'
import { ConstantProductPoolCode } from '../pools/ConstantProductPool'
import type { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

const syncAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve0',
        type: 'uint112',
      },
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve1',
        type: 'uint112',
      },
    ],
    name: 'Sync',
    type: 'event',
  },
]

interface PoolInfo {
  poolCode: PoolCode
  fetchType: 'INITIAL' | 'ON_DEMAND'
  updatedAtBlock: number
}

export abstract class UniswapV2BaseProvider extends LiquidityProvider {
  pools: Map<string, PoolInfo> = new Map()
  blockListener?: () => void
  unwatchBlockNumber?: () => void
  unwatchMulticall?: () => void
  fee = 0.003
  isInitialized = false
  factory: { [chainId: number]: Address } = {}
  initCodeHash: { [chainId: number]: string } = {}
  constructor(chainId: ChainId, factory: { [chainId: number]: Address }, initCodeHash: { [chainId: number]: string }) {
    super(chainId)
    this.factory = factory
    this.initCodeHash = initCodeHash
    if (!(chainId in this.factory) || !(chainId in this.initCodeHash)) {
      throw new Error(`${this.getType()} cannot be instantiated for chainid ${chainId}, no factory or initCodeHash`)
    }
  }
  readonly TOP_POOL_SIZE = 155
  readonly TOP_POOL_LIQUIDITY_THRESHOLD = 5000
  readonly ON_DEMAND_POOL_SIZE = 20

  async initialize(blockNumber: number) {
    this.isInitialized = true
    const type = this.getType()

    const topPools = await getTopPools(
      this.chainId,
      type === LiquidityProviders.UniswapV2 ? 'Uniswap' : type,
      type === LiquidityProviders.SushiSwap ? 'LEGACY' : 'V2',
      ['CONSTANT_PRODUCT_POOL'],
      this.TOP_POOL_SIZE,
      this.TOP_POOL_LIQUIDITY_THRESHOLD
    )
    if (topPools.size > 0) {
      console.debug(
        `${chainShortName[this.chainId]}/${this.chainId}~${
          this.lastUpdateBlock
        }~${this.getType()} - INIT: top pools found: ${topPools.size}`
      )
    } else {
      console.debug(
        `${chainShortName[this.chainId]}/${this.chainId}~${
          this.lastUpdateBlock
        }~${this.getType()} - INIT: NO pools found.`
      )
      return
    }

    const pools = Array.from(topPools.values())

    const reserves = await readContracts({
      allowFailure: true,
      contracts: pools.map((pool) => ({
        address: pool.address as Address,
        chainId: this.chainId,
        abi: getReservesAbi,
        functionName: 'getReserves',
      })),
    })

    pools.map((pool, i) => {
      const res = reserves[i]
      if (res !== null && res !== undefined) {
        const toks = [pool.token0, pool.token1]
        const rPool = new ConstantProductRPool(
          pool.address,
          toks[0] as RToken,
          toks[1] as RToken,
          this.fee,
          res[0],
          res[1]
        )
        const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
        this.pools.set(pool.address, { poolCode: pc, fetchType: 'INITIAL', updatedAtBlock: blockNumber })
        ++this.stateId
      } else {
        console.error(
          `${chainShortName[this.chainId]}/${this.chainId}~${
            this.lastUpdateBlock
          }~${this.getType()} - ERROR INIT SYNC, Failed to fetch reserves for pool: ${pool.address}`
        )
      }
    })

    console.debug(
      `${chainShortName[this.chainId]}/${this.chainId}~${this.lastUpdateBlock}~${this.getType()} - INIT, WATCHING ${
        this.pools.size
      } POOLS`
    )
  }

  async getPools(t0: Token, t1: Token): Promise<void> {

    console.debug(`****** ${this.getType()} POOLS IN MEMORY:`, this.pools.size)

    const type = this.getType()

    const poolsOnDemand = await getPoolsByTokenIds(
      this.chainId,
      type === LiquidityProviders.UniswapV2 ? 'Uniswap' : type,
      type === LiquidityProviders.SushiSwap ? 'LEGACY' : 'V2',
      ['CONSTANT_PRODUCT_POOL'],
      t0.address,
      t1.address,
      this.TOP_POOL_SIZE,
      this.TOP_POOL_LIQUIDITY_THRESHOLD,
      this.ON_DEMAND_POOL_SIZE
    )

    console.debug(
      `${chainShortName[this.chainId]}/${this.chainId}~${
        this.lastUpdateBlock
      }~${this.getType()} - ON DEMAND: Begin fetching reserves for ${poolsOnDemand.size} pools`
    )

    const pools = Array.from(poolsOnDemand.values())

    const reserves = await readContracts({
      allowFailure: true,
      contracts: pools.map((pool) => ({
        address: pool.address as Address,
        chainId: this.chainId,
        abi: getReservesAbi,
        functionName: 'getReserves',
      })),
    })

    pools.map((pool, i) => {
      const res = reserves[i]
      if (res !== null && res !== undefined) {
        const toks = [pool.token0, pool.token1]
        const rPool = new ConstantProductRPool(
          pool.address,
          toks[0] as RToken,
          toks[1] as RToken,
          this.fee,
          res[0],
          res[1]
        )
        const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
        this.pools.set(pool.address, { poolCode: pc, fetchType: 'ON_DEMAND', updatedAtBlock: this.lastUpdateBlock })
        ++this.stateId
      } else {
        console.error(
          `${chainShortName[this.chainId]}/${this.chainId}~${
            this.lastUpdateBlock
          }~${this.getType()} - ERROR ON DEMAND, Failed to fetch reserves for pool: ${pool.address}`
        )
      }
    })
  }

  async updatePools() {
    const pools = Array.from(this.pools.values())
    const reserves = await readContracts({
      allowFailure: true,
      contracts: pools.map((pool) => ({
        address: pool.poolCode.pool.address as Address,
        chainId: this.chainId,
        abi: getReservesAbi,
        functionName: 'getReserves',
      })),
    })

    pools.map((poolInfo, i) => {
      const pool = poolInfo.poolCode.pool
      const res = reserves[i]
      if (res !== null && res !== undefined && res[0] !== null && res[1] !== null) {
        if (!pool.reserve0.eq(res[0]) || !pool.reserve1.eq(res[1])) {
          pool.updateReserves(res[0], res[1])
          console.error(
            `${chainShortName[this.chainId]}/${this.chainId}~${
              this.lastUpdateBlock
            }~${this.getType()} - SYNC, pool: ${pool.address} ${pool.token0.symbol}/${pool.token1.symbol} ${res[0].toString()} ${res[1].toString()}`
          )
          ++this.stateId
        }
      } else {
        console.error(
          `${chainShortName[this.chainId]}/${this.chainId}~${
            this.lastUpdateBlock
          }~${this.getType()} - ERROR UPDATING RESERVES, Failed to fetch reserves for pool: ${pool.address}`
        )
      }
    })
  }

  _getPoolAddress(t1: Token, t2: Token): string {
    return getCreate2Address(
      this.factory[this.chainId as keyof typeof this.factory],
      keccak256(['bytes'], [pack(['address', 'address'], [t1.address, t2.address])]),
      this.initCodeHash[this.chainId as keyof typeof this.initCodeHash]
    )
  }

  // TODO: Decide if this is worth keeping as fallback in case fetching top pools fails? only used on initial load.
  _getProspectiveTokens(t0: Token, t1: Token) {
    const set = new Set<Token>([
      t0,
      t1,
      ...BASES_TO_CHECK_TRADES_AGAINST[this.chainId],
      ...(ADDITIONAL_BASES[this.chainId][t0.address] || []),
      ...(ADDITIONAL_BASES[this.chainId][t1.address] || []),
    ])
    return Array.from(set)
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.pools = new Map()

    this.unwatchBlockNumber = watchBlockNumber(
      {
        listen: true,
      },
      (blockNumber) => {
        this.lastUpdateBlock = blockNumber
        this.removeStalePools(blockNumber)
        this.updatePools()

        if (!this.isInitialized) {
          this.initialize(blockNumber)
        }
      }
    )
  }

  private removeStalePools(blockNumber: number) {
    // TODO: move this to a per-chain config?
    const blockThreshold = blockNumber - 75
    let removed = 0

    for (const [k, v] of this.pools) {
      if (v.updatedAtBlock < blockThreshold && v.fetchType === 'ON_DEMAND') {
        removed++
        this.pools.delete(k)
      }
    }

    if (removed > 0) {
      console.log(
        `${chainShortName[this.chainId]}/${this.chainId}~${
          this.lastUpdateBlock
        }~${this.getType()} -Removed ${removed} stale pools`
      )
    }
  }

  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(t0, t1)
  }

  getCurrentPoolList(): PoolCode[] {
    return [...this.pools.values()].map((p) => p.poolCode)
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber()
    if (this.unwatchMulticall) this.unwatchMulticall()
    this.blockListener = undefined
  }
}
