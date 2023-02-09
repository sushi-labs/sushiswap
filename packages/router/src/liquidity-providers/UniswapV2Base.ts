import { keccak256, pack } from '@ethersproject/solidity'
import { getReservesAbi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { Address, readContracts, watchBlockNumber } from '@wagmi/core'
import { BigNumber } from 'ethers'
import { getCreate2Address } from 'ethers/lib/utils'

import { getPoolsByTokenIds, getTopPools } from '../lib/api'
import { ConstantProductPoolCode } from '../pools/ConstantProductPool'
import type { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

interface PoolInfo {
  poolCode: PoolCode
  validUntilBlock: number
}

export abstract class UniswapV2BaseProvider extends LiquidityProvider {
  initialPools: Map<string, PoolCode> = new Map()
  poolsByTrade: Map<string, string[]> = new Map()
  onDemandPools: Map<string, PoolInfo> = new Map()
  
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

  async initialize() {
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
      console.debug(`${this.getLogPrefix()} - INIT: top pools found: ${topPools.size}`)
    } else {
      console.debug(`${this.getLogPrefix()} - INIT: NO pools found.`)
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
        const pc = new ConstantProductPoolCode(rPool, this.getType(), this.getPoolProviderName())
        this.initialPools.set(pool.address, pc)
        ++this.stateId
      } else {
        console.error(`${this.getLogPrefix()} - ERROR INIT SYNC, Failed to fetch reserves for pool: ${pool.address}`)
      }
    })

    console.debug(`${this.getLogPrefix()} - INIT, WATCHING ${this.initialPools.size} POOLS`)
  }

  async getOnDemandPools(t0: Token, t1: Token): Promise<void> {
    console.debug(`****** MEM - ${this.getType()} INITIAL POOLS:`, this.initialPools.size)

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

    const pools = Array.from(poolsOnDemand.values()).filter((pool) => !this.initialPools.has(pool.address))

    this.poolsByTrade.set(this.getTradeId(t0, t1), pools.map((pool) => pool.address))

    const validUntilBlock = this.lastUpdateBlock + this.ON_DEMAND_POOLS_BLOCK_LIFETIME
    pools.forEach((pool) => {
      const existingPool = this.onDemandPools.get(pool.address)
      if (existingPool === undefined) {
        const toks = [pool.token0, pool.token1]
        const rPool = new ConstantProductRPool(
          pool.address,
          toks[0] as RToken,
          toks[1] as RToken,
          this.fee,
          BigNumber.from(0),
          BigNumber.from(0)
        )

        const pc = new ConstantProductPoolCode(rPool, this.getType(), this.getPoolProviderName())
        this.onDemandPools.set(pool.address, { poolCode: pc, validUntilBlock })
      } else {
        existingPool.validUntilBlock = validUntilBlock
      }
    })
    console.debug(`${this.getLogPrefix()} - ON DEMAND: Found ${pools.length} pools`)
  }

  async updatePools() {
    if (this.isInitialized) {
      this.removeStalePools()

      const initialPools = Array.from(this.initialPools.values())
      const onDemandPools = Array.from(this.onDemandPools.values())

      const [initialPoolsReserves, onDemandPoolsReserves] = await Promise.all([
        readContracts({
          allowFailure: true,
          contracts: initialPools.map((poolCode) => ({
            address: poolCode.pool.address as Address,
            chainId: this.chainId,
            abi: getReservesAbi,
            functionName: 'getReserves',
          })),
        }),
        readContracts({
          allowFailure: true,
          contracts: onDemandPools.map((poolInfo) => ({
            address: poolInfo.poolCode.pool.address as Address,
            chainId: this.chainId,
            abi: getReservesAbi,
            functionName: 'getReserves',
          })),
        }),
      ])

      initialPools.forEach((poolCode, i) => {
        const pool = poolCode.pool
        const res = initialPoolsReserves[i]
        if (res !== null && res !== undefined) {
          if (!pool.reserve0.eq(res[0]) || !pool.reserve1.eq(res[1])) {
            pool.updateReserves(res[0], res[1])
            console.info(
              `${this.getLogPrefix()} - SYNC, init-pool: ${pool.address} ${pool.token0.symbol}/${
                pool.token1.symbol
              } ${res[0].toString()} ${res[1].toString()}`
            )
            ++this.stateId
          }
        } else {
          console.error(
            `${this.getLogPrefix()} - ERROR UPDATING RESERVES for a initial pool, Failed to fetch reserves for pool: ${
              pool.address
            }`
          )
        }
      })

      onDemandPools.forEach((poolInfo, i) => {
        const pool = poolInfo.poolCode.pool
        const res = onDemandPoolsReserves[i]
        if (res !== null && res !== undefined) {
          if (!pool.reserve0.eq(res[0]) || !pool.reserve1.eq(res[1])) {
            pool.updateReserves(res[0], res[1])
            console.info(
              `${this.getLogPrefix()} - SYNC, on-demand pool: ${pool.address} ${pool.token0.symbol}/${
                pool.token1.symbol
              } ${res[0].toString()} ${res[1].toString()}`
            )
            ++this.stateId
          }
        } else {
          console.error(
            `${this.getLogPrefix()} - ERROR UPDATING RESERVES for a on-demand pool, Failed to fetch reserves for pool: ${
              pool.address
            }`
          )
        }
      })
    }
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
    this.initialPools = new Map()

    this.unwatchBlockNumber = watchBlockNumber(
      {
        listen: true,
      },
      (blockNumber) => {
        this.lastUpdateBlock = blockNumber
        this.updatePools()

        if (!this.isInitialized) {
          this.initialize()
        }
      }
    )
  }

  private removeStalePools() {
    let removed = 0
    for (const poolInfo of this.onDemandPools.values()) {
      if (poolInfo.validUntilBlock < this.lastUpdateBlock) {
        this.onDemandPools.delete(poolInfo.poolCode.pool.address)
        removed++
      }
    }
    if (removed > 0) {
      console.log(`${this.getLogPrefix()} -Removed ${removed} stale pools`)
    }
  }

  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getOnDemandPools(t0, t1)
  }

  getCurrentPoolList(t0: Token, t1: Token): PoolCode[] {
    const tradeId = this.getTradeId(t0, t1)
    const poolsByTrade = this.poolsByTrade.get(tradeId) ?? []
    const onDemandPoolCodes = poolsByTrade
      ? Array.from(this.onDemandPools)
          .filter(([poolAddress]) => poolsByTrade.includes(poolAddress))
          .map(([, p]) => p.poolCode)
      : []

    return [...this.initialPools.values(), onDemandPoolCodes].flat()
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber()
    if (this.unwatchMulticall) this.unwatchMulticall()
    this.blockListener = undefined
  }
}
